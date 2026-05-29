import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db"
import { experienceInput, type Experience } from "@/lib/schemas/experience"

const COLLECTION = "experience"

function toClient(doc: { _id: ObjectId } & Record<string, unknown>) {
  const { _id, ...rest } = doc
  return { _id: _id.toString(), ...rest } as unknown as Experience
}

export async function listExperience(publishedOnly = true): Promise<Experience[]> {
  const db = await getDb()
  const q = publishedOnly ? { published: true } : {}
  const docs = await db.collection(COLLECTION).find(q).sort({ order: 1, createdAt: -1 }).toArray()
  return docs.map((d) => toClient(d as never))
}

export async function getExperienceById(id: string): Promise<Experience | null> {
  if (!ObjectId.isValid(id)) return null
  const db = await getDb()
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) })
  return doc ? toClient(doc as never) : null
}

export async function createExperience(raw: unknown): Promise<Experience> {
  const input = experienceInput.parse(raw)
  const db = await getDb()
  const now = new Date()
  const result = await db.collection(COLLECTION).insertOne({ ...input, createdAt: now, updatedAt: now })
  const created = await db.collection(COLLECTION).findOne({ _id: result.insertedId })
  return toClient(created as never)
}

export async function updateExperience(id: string, raw: unknown): Promise<Experience | null> {
  if (!ObjectId.isValid(id)) return null
  const input = experienceInput.partial().parse(raw)
  const db = await getDb()
  await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...input, updatedAt: new Date() } },
  )
  return getExperienceById(id)
}

export async function deleteExperience(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false
  const db = await getDb()
  const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount === 1
}

export async function ensureIndexes() {
  const db = await getDb()
  await db.collection(COLLECTION).createIndex({ order: 1, published: 1 })
}
