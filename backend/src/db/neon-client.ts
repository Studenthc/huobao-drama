import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'

import * as pgSchema from './postgres-schema.js'

function requireDatabaseUrl() {
  const value = process.env.DATABASE_URL?.trim()
  if (!value) {
    throw new Error('DATABASE_URL is required for Neon/Postgres')
  }
  return value
}

export function hasNeonDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL?.trim())
}

export function createNeonSqlClient() {
  return postgres(requireDatabaseUrl(), {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 15,
  })
}

export function createNeonDb() {
  const sql = createNeonSqlClient()
  return drizzle(sql, { schema: pgSchema })
}

export async function checkNeonConnection() {
  const sql = createNeonSqlClient()
  try {
    const result = await sql`select current_database() as database, now()::text as now`
    return {
      ok: true,
      database: result[0]?.database ?? null,
      now: result[0]?.now ?? null,
    }
  } finally {
    await sql.end({ timeout: 5 })
  }
}
