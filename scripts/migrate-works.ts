/**
 * 작품 컬렉션 일회용 마이그레이션:
 *   - type: "featured" | "other" | (없음) → "general"
 *   - type: "building" → "general" + status: "in-progress"
 *   - status 가 없는 모든 도큐먼트 → status: "completed" (기존 building 제외)
 *
 * 실행:  npx tsx scripts/migrate-works.ts
 */
import { config } from "dotenv"
import { MongoClient } from "mongodb"

config({ path: ".env.local" })
config({ path: ".env" })

async function main() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error("✗ MONGODB_URI 환경변수가 없습니다.")
    process.exit(1)
  }

  const client = await new MongoClient(uri).connect()
  const db = client.db(process.env.MONGODB_DB ?? "portfolio")
  const col = db.collection("works")

  // 1) building → general + status=in-progress
  const buildingRes = await col.updateMany(
    { type: "building" },
    { $set: { type: "general", status: "in-progress" } },
  )
  console.log(`▶ building → general+in-progress: ${buildingRes.modifiedCount} 건`)

  // 2) featured | other → general (status 비어있으면 completed)
  const legacyRes = await col.updateMany(
    { type: { $in: ["featured", "other"] } },
    [
      {
        $set: {
          type: "general",
          status: { $ifNull: ["$status", "completed"] },
        },
      },
    ],
  )
  console.log(`▶ featured/other → general: ${legacyRes.modifiedCount} 건`)

  // 3) type 자체가 비어있는 문서 → general
  const missingTypeRes = await col.updateMany(
    { type: { $exists: false } },
    [
      {
        $set: {
          type: "general",
          status: { $ifNull: ["$status", "completed"] },
        },
      },
    ],
  )
  console.log(`▶ type 없음 → general: ${missingTypeRes.modifiedCount} 건`)

  // 4) 나머지 status 비어있는 문서 → completed
  const missingStatusRes = await col.updateMany(
    { status: { $exists: false } },
    { $set: { status: "completed" } },
  )
  console.log(`▶ status 보강: ${missingStatusRes.modifiedCount} 건`)

  // 결과 확인
  const after = await col
    .aggregate([{ $group: { _id: { type: "$type", status: "$status" }, n: { $sum: 1 } } }])
    .toArray()
  console.log("\n── 마이그레이션 후 분포 ──")
  for (const row of after) console.log("  ", row._id, "→", row.n)

  await client.close()
  console.log("\n✓ 완료")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
