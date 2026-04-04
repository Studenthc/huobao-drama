import { and, eq, isNull } from 'drizzle-orm'

import { db, executeWrite, insertAndReturnOne, queryAll, queryFirst, schema } from '../index.js'

export async function listAiServiceConfigs() {
  return queryAll(db.select().from(schema.aiServiceConfigs))
}

export async function listAiServiceConfigsByServiceType(serviceType: string) {
  return queryAll(
    db.select()
      .from(schema.aiServiceConfigs)
      .where(eq(schema.aiServiceConfigs.serviceType, serviceType)),
  )
}

export async function getPreferredActiveAiServiceConfig(serviceType: string) {
  const rows = (await listAiServiceConfigsByServiceType(serviceType))
    .filter((row) => row.isActive)
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
  return rows[0] ?? null
}

export async function getAiServiceConfigById(id: number) {
  return queryFirst(
    db.select()
      .from(schema.aiServiceConfigs)
      .where(eq(schema.aiServiceConfigs.id, id)),
  )
}

export async function findAiServiceConfigByServiceTypeAndProvider(serviceType: string, provider: string) {
  const rows = await listAiServiceConfigsByServiceType(serviceType)
  return rows.find((row) => row.provider === provider) ?? null
}

export async function createAiServiceConfig(values: typeof schema.aiServiceConfigs.$inferInsert) {
  return insertAndReturnOne(schema.aiServiceConfigs, values, schema.aiServiceConfigs.id)
}

export async function updateAiServiceConfig(id: number, updates: Partial<typeof schema.aiServiceConfigs.$inferInsert>) {
  await executeWrite(
    db.update(schema.aiServiceConfigs)
      .set(updates)
      .where(eq(schema.aiServiceConfigs.id, id)),
  )
}

export async function deleteAiServiceConfig(id: number) {
  await executeWrite(
    db.delete(schema.aiServiceConfigs)
      .where(eq(schema.aiServiceConfigs.id, id)),
  )
}

export async function listAiServiceProviders() {
  return queryAll(db.select().from(schema.aiServiceProviders))
}

export async function listAgentConfigs() {
  return queryAll(
    db.select()
      .from(schema.agentConfigs)
      .where(isNull(schema.agentConfigs.deletedAt)),
  )
}

export async function getAgentConfigById(id: number) {
  return queryFirst(
    db.select()
      .from(schema.agentConfigs)
      .where(eq(schema.agentConfigs.id, id)),
  )
}

export async function getAgentConfigByType(agentType: string) {
  return queryFirst(
    db.select()
      .from(schema.agentConfigs)
      .where(eq(schema.agentConfigs.agentType, agentType)),
  )
}

export async function getPreferredAgentConfigByType(agentType: string) {
  const rows = (await listAgentConfigs())
    .filter((row) => row.agentType === agentType)
  return rows.find((row) => row.isActive) ?? rows[0] ?? null
}

export async function createAgentConfig(values: typeof schema.agentConfigs.$inferInsert) {
  return insertAndReturnOne(schema.agentConfigs, values, schema.agentConfigs.id)
}

export async function updateAgentConfig(id: number, updates: Partial<typeof schema.agentConfigs.$inferInsert>) {
  await executeWrite(
    db.update(schema.agentConfigs)
      .set(updates)
      .where(eq(schema.agentConfigs.id, id)),
  )
}

export async function listAiVoicesByProvider(provider: string) {
  return queryAll(
    db.select()
      .from(schema.aiVoices)
      .where(eq(schema.aiVoices.provider, provider)),
  )
}

export async function replaceAiVoicesForProvider(
  provider: string,
  rows: Array<typeof schema.aiVoices.$inferInsert>,
) {
  await executeWrite(
    db.delete(schema.aiVoices)
      .where(eq(schema.aiVoices.provider, provider)),
  )

  if (!rows.length) return

  await executeWrite(
    db.insert(schema.aiVoices).values(rows),
  )
}

export async function listActiveAgentConfigs() {
  return queryAll(
    db.select()
      .from(schema.agentConfigs)
      .where(
        and(
          isNull(schema.agentConfigs.deletedAt),
          eq(schema.agentConfigs.isActive, true),
        ),
      ),
  )
}
