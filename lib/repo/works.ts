import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db"
import { workInput, type Work, type WorkType } from "@/lib/schemas/work"

const COLLECTION = "works"

function toClient(doc: Record<string, unknown> & { _id: ObjectId }): Work {
  const { _id, ...rest } = doc
  return { _id: _id.toString(), ...rest } as unknown as Work
}

export async function listWorks(filter: { type?: WorkType; publishedOnly?: boolean } = {}): Promise<Work[]> {
  const db = await getDb()
  const q: Record<string, unknown> = {}
  if (filter.type) q.type = filter.type
  if (filter.publishedOnly !== false) q.published = true
  const docs = await db.collection(COLLECTION).find(q).sort({ order: 1, createdAt: -1 }).toArray()
  return docs.map((d) => toClient(d as never))
}

export async function getWorkBySlug(slug: string): Promise<Work | null> {
  const db = await getDb()
  const doc = await db.collection(COLLECTION).findOne({ slug })
  return doc ? toClient(doc as never) : null
}

export async function getWorkById(id: string): Promise<Work | null> {
  if (!ObjectId.isValid(id)) return null
  const db = await getDb()
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) })
  return doc ? toClient(doc as never) : null
}

export async function createWork(raw: unknown): Promise<Work> {
  const input = workInput.parse(raw)
  const db = await getDb()
  const now = new Date()
  const result = await db.collection(COLLECTION).insertOne({ ...input, createdAt: now, updatedAt: now })
  const created = await db.collection(COLLECTION).findOne({ _id: result.insertedId })
  return toClient(created as never)
}

export async function updateWork(id: string, raw: unknown): Promise<Work | null> {
  if (!ObjectId.isValid(id)) return null
  const input = workInput.partial().parse(raw)
  const db = await getDb()
  await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...input, updatedAt: new Date() } },
  )
  return getWorkById(id)
}

export async function deleteWork(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false
  const db = await getDb()
  const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount === 1
}

export async function reorderWorks(ids: string[]): Promise<void> {
  const db = await getDb()
  const ops = ids.map((id, order) => ({
    updateOne: { filter: { _id: new ObjectId(id) }, update: { $set: { order, updatedAt: new Date() } } },
  }))
  if (ops.length > 0) await db.collection(COLLECTION).bulkWrite(ops)
}

/** 인덱스 확보 (서버 시작 시 한 번 호출). */
export async function ensureIndexes() {
  const db = await getDb()
  await db.collection(COLLECTION).createIndex({ slug: 1 }, { unique: true })
  await db.collection(COLLECTION).createIndex({ type: 1, order: 1, published: 1 })
}
