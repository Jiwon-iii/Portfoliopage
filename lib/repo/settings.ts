import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db"
import { settingsInput, type Settings } from "@/lib/schemas/settings"

const COLLECTION = "settings"
const SINGLETON_SLUG = "main"

function toClient(doc: { _id: ObjectId } & Record<string, unknown>) {
  const { _id, ...rest } = doc
  return { _id: _id.toString(), ...rest } as unknown as Settings
}

export async function getSettings(): Promise<Settings | null> {
  const db = await getDb()
  const doc = await db.collection(COLLECTION).findOne({ slug: SINGLETON_SLUG })
  return doc ? toClient(doc as never) : null
}

export async function upsertSettings(raw: unknown): Promise<Settings> {
  const input = settingsInput.parse(raw)
  const db = await getDb()
  await db.collection(COLLECTION).updateOne(
    { slug: SINGLETON_SLUG },
    { $set: { ...input, slug: SINGLETON_SLUG, updatedAt: new Date() } },
    { upsert: true },
  )
  const doc = await db.collection(COLLECTION).findOne({ slug: SINGLETON_SLUG })
  return toClient(doc as never)
}
