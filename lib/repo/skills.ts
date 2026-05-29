import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db"
import { skillInput, type Skill, type SkillCategory } from "@/lib/schemas/skill"

const COLLECTION = "skills"

function toClient(doc: { _id: ObjectId } & Record<string, unknown>) {
  const { _id, ...rest } = doc
  return { _id: _id.toString(), ...rest } as unknown as Skill
}

export async function listSkills(category?: SkillCategory): Promise<Skill[]> {
  const db = await getDb()
  const q: Record<string, unknown> = { published: true }
  if (category) q.category = category
  const docs = await db.collection(COLLECTION).find(q).sort({ order: 1, createdAt: -1 }).toArray()
  return docs.map((d) => toClient(d as never))
}

export async function listSkillsByCategory(): Promise<Record<SkillCategory, Skill[]>> {
  const all = await listSkills()
  return {
    main: all.filter((s) => s.category === "main"),
    usable: all.filter((s) => s.category === "usable"),
  }
}

export async function getSkillById(id: string): Promise<Skill | null> {
  if (!ObjectId.isValid(id)) return null
  const db = await getDb()
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) })
  return doc ? toClient(doc as never) : null
}

export async function createSkill(raw: unknown): Promise<Skill> {
  const input = skillInput.parse(raw)
  const db = await getDb()
  const now = new Date()
  const result = await db.collection(COLLECTION).insertOne({ ...input, createdAt: now, updatedAt: now })
  const created = await db.collection(COLLECTION).findOne({ _id: result.insertedId })
  return toClient(created as never)
}

export async function updateSkill(id: string, raw: unknown): Promise<Skill | null> {
  if (!ObjectId.isValid(id)) return null
  const input = skillInput.partial().parse(raw)
  const db = await getDb()
  await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...input, updatedAt: new Date() } },
  )
  return getSkillById(id)
}

export async function deleteSkill(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false
  const db = await getDb()
  const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount === 1
}

export async function ensureIndexes() {
  const db = await getDb()
  await db.collection(COLLECTION).createIndex({ category: 1, order: 1, published: 1 })
}
