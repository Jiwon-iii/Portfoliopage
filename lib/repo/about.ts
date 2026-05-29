import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db"
import { aboutInput, type About } from "@/lib/schemas/about"

const COLLECTION = "about"
const SINGLETON_SLUG = "main"

function toClient(doc: { _id: ObjectId } & Record<string, unknown>) {
  const { _id, ...rest } = doc
  return { _id: _id.toString(), ...rest } as unknown as About
}

export async function getAbout(): Promise<About | null> {
  const db = await getDb()
  const doc = await db.collection(COLLECTION).findOne({ slug: SINGLETON_SLUG })
  return doc ? toClient(doc as never) : null
}

export async function upsertAbout(raw: unknown): Promise<About> {
  const input = aboutInput.parse(raw)
  const db = await getDb()
  await db.collection(COLLECTION).updateOne(
    { slug: SINGLETON_SLUG },
    { $set: { ...input, slug: SINGLETON_SLUG, updatedAt: new Date() } },
    { upsert: true },
  )
  const doc = await db.collection(COLLECTION).findOne({ slug: SINGLETON_SLUG })
  return toClient(doc as never)
}
