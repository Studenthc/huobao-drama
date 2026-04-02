# TrendShort Studio Neon Migration

This Studio currently runs on SQLite with Drizzle and a local file database.

Current state:

- driver: `better-sqlite3`
- schema: `drizzle-orm/sqlite-core`
- runtime DB file: `data/huobao_drama.db`

For commercial multi-user deployment, this should move to Neon/Postgres.

## Migration Goal

Move `trendshort-studio` from:

- SQLite
- single-file local persistence
- single-instance friendly storage

to:

- Neon Postgres
- remote shared persistence
- multi-instance safe backend storage

## Required Code Changes

### 1. Driver

Replace:

- `better-sqlite3`
- `drizzle-orm/better-sqlite3`

with a Postgres driver stack.

Recommended target:

- `postgres`
- `drizzle-orm/postgres-js`
- `drizzle-orm/pg-core`

### 2. Schema

Convert all table definitions in:

- [backend/src/db/schema.ts](./backend/src/db/schema.ts)

from `sqliteTable(...)` to `pgTable(...)`.

Important review points:

- integer autoincrement keys
- booleans
- text/json columns
- timestamps
- default values
- composite primary keys

### 3. DB bootstrap

Replace:

- [backend/src/db/index.ts](./backend/src/db/index.ts)

Current responsibilities that must be reworked:

- SQLite file initialization
- `PRAGMA` setup
- ad-hoc `ensureColumn(...)`
- local `CREATE TABLE IF NOT EXISTS ...`

Target responsibilities:

- connect to `DATABASE_URL`
- initialize Drizzle Postgres client
- use managed migrations instead of inline table creation

### 4. Migrations

Stop relying on runtime schema mutation in app boot.

Target:

- checked-in Drizzle migrations
- explicit migration apply step in deploy pipeline

### 5. Runtime configuration

Add production envs:

- `DATABASE_URL`
- `DATABASE_DIRECT_URL` (optional)

Keep `DB_PATH` only for local legacy SQLite support during transition.

## Recommended Cutover Strategy

### Phase 1

- finish ownership scope and access boundaries
- freeze new schema churn
- extract all SQLite-only assumptions into DB layer

### Phase 2

- port schema to `pg-core`
- introduce Postgres client in parallel branch
- run Studio builds and API tests against Neon

### Phase 3

- migrate existing SQLite data into Neon
- switch staging to Neon
- validate SSO, billing callbacks, assets/tasks overview, episode creation

### Phase 4

- cut production to Neon
- retire SQLite as default production path

## Current Preconditions Already Done

- TrendShort-specific integration code is isolated under:
  - `backend/src/integrations/trendshort/*`
  - `frontend/app/integrations/trendshort/*`
- ownership groundwork exists for Studio access scope
- upstream fork strategy is documented in:
  - [FORK_STRATEGY.md](./FORK_STRATEGY.md)

That means the next Neon phase can focus on storage and schema, not on redoing integration boundaries.
