import 'dotenv/config'

import { checkNeonConnection, hasNeonDatabaseUrl } from '../src/db/neon-client.js'

async function main() {
  if (!hasNeonDatabaseUrl()) {
    throw new Error('DATABASE_URL is not configured')
  }

  const result = await checkNeonConnection()
  console.log(JSON.stringify(result, null, 2))
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
