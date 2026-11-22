import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db"
import { expertiseInput, type Expertise } from "@/lib/schemas/expertise"

const COLLECTION = "expertise"

function toClient(doc: { _id: ObjectId } & Record<string, unknown>) {
  const { _id, ...rest } = doc
  return { _id: _id.toString(), ...rest } as unknown as Expertise
}

export async function listExpertise(publishedOnly = true): Promise<Expertise[]> {
  const db = await getDb()
  const docs = await db
    .collection(COLLECTION)
    .find(publishedOnly ? { published: true } : {})
    .sort({ order: 1, createdAt: 1 })
    .toArray()
  return docs.map((d) => toClient(d as never))
}

export async function getExpertiseById(id: string): Promise<Expertise | null> {
  if (!ObjectId.isValid(id)) return null
  const db = await getDb()
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) })
  return doc ? toClient(doc as never) : null
}

export async function createExpertise(raw: unknown): Promise<Expertise> {
  const input = expertiseInput.parse(raw)
  const db = await getDb()
  const now = new Date()
  const result = await db.collection(COLLECTION).insertOne({ ...input, createdAt: now, updatedAt: now })
  const created = await db.collection(COLLECTION).findOne({ _id: result.insertedId })
  return toClient(created as never)
}

export async function updateExpertise(id: string, raw: unknown): Promise<Expertise | null> {
  if (!ObjectId.isValid(id)) return null
  const parsed = expertiseInput.partial().parse(raw)
  // zod v4 partial() 은 default 를 채움 → 실제로 보낸 칸만 저장
  const sent = raw && typeof raw === "object" ? Object.keys(raw) : []
  const input = Object.fromEntries(Object.entries(parsed).filter(([k]) => sent.includes(k)))
  const db = await getDb()
  await db.collection(COLLECTION).updateOne({ _id: new ObjectId(id) }, { $set: { ...input, updatedAt: new Date() } })
  return getExpertiseById(id)
}

export async function deleteExpertise(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false
  const db = await getDb()
  const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount === 1
}
