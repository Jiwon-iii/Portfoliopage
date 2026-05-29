import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db"
import { educationInput, type Education } from "@/lib/schemas/education"

const COLLECTION = "education"

function toClient(doc: { _id: ObjectId } & Record<string, unknown>) {
  const { _id, ...rest } = doc
  return { _id: _id.toString(), ...rest } as unknown as Education
}

export async function listEducation(publishedOnly = true): Promise<Education[]> {
  const db = await getDb()
  const q = publishedOnly ? { published: true } : {}
  const docs = await db.collection(COLLECTION).find(q).sort({ order: 1, createdAt: -1 }).toArray()
  return docs.map((d) => toClient(d as never))
}

export async function getEducationById(id: string): Promise<Education | null> {
  if (!ObjectId.isValid(id)) return null
  const db = await getDb()
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) })
  return doc ? toClient(doc as never) : null
}

export async function createEducation(raw: unknown): Promise<Education> {
  const input = educationInput.parse(raw)
  const db = await getDb()
  const now = new Date()
  const result = await db.collection(COLLECTION).insertOne({ ...input, createdAt: now, updatedAt: now })
  const created = await db.collection(COLLECTION).findOne({ _id: result.insertedId })
  return toClient(created as never)
}

export async function updateEducation(id: string, raw: unknown): Promise<Education | null> {
  if (!ObjectId.isValid(id)) return null
  const input = educationInput.partial().parse(raw)
  const db = await getDb()
  await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...input, updatedAt: new Date() } },
  )
  return getEducationById(id)
}

export async function deleteEducation(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false
  const db = await getDb()
  const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount === 1
}

export async function ensureIndexes() {
  const db = await getDb()
  await db.collection(COLLECTION).createIndex({ order: 1, published: 1 })
}
