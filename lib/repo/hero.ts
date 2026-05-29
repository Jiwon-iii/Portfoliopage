import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db"
import { heroInput, type Hero } from "@/lib/schemas/hero"

const COLLECTION = "hero"
const SINGLETON_SLUG = "main"

function toClient(doc: { _id: ObjectId } & Record<string, unknown>) {
  const { _id, ...rest } = doc
  return { _id: _id.toString(), ...rest } as unknown as Hero
}

/**
 * Hero 는 단일 도큐먼트 — slug='main' 으로 검색·upsert.
 */
export async function getHero(): Promise<Hero | null> {
  const db = await getDb()
  const doc = await db.collection(COLLECTION).findOne({ slug: SINGLETON_SLUG })
  return doc ? toClient(doc as never) : null
}

export async function upsertHero(raw: unknown): Promise<Hero> {
  const input = heroInput.parse(raw)
  const db = await getDb()
  const now = new Date()
  await db.collection(COLLECTION).updateOne(
    { slug: SINGLETON_SLUG },
    { $set: { ...input, slug: SINGLETON_SLUG, updatedAt: now } },
    { upsert: true },
  )
  const doc = await db.collection(COLLECTION).findOne({ slug: SINGLETON_SLUG })
  return toClient(doc as never)
}
