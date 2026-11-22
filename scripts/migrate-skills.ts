/**
 * 기술(skills) 컬렉션 일회용 마이그레이션: 주력/활용 2분류 → 자기소개 PPT 「技術スキル」 7묶음.
 *   1) 지금 문서를 전부 JSON 으로 백업
 *   2) 새 31개를 넣은 뒤 예전 문서를 지움 (넣기가 실패하면 예전 문서는 그대로)
 *   - 이미 새 묶음(frontend 등) 문서가 있으면 아무것도 안 함 (두 번 실행 방지)
 *
 * 실행:  npx tsx scripts/migrate-skills.ts <백업파일.json>
 */
import { writeFileSync } from "node:fs"
import { config } from "dotenv"
import { MongoClient } from "mongodb"
import { skillInput, skillCategory, type SkillCategory } from "../lib/schemas/skill"

config({ path: ".env.local" })
config({ path: ".env" })

type Name = string | { ko: string; ja: string; en: string }
const GROUPS: [SkillCategory, Name[]][] = [
  ["frontend", ["Next.js", "React", "TypeScript", "Tailwind CSS", "shadcn/ui"]],
  ["backend", ["Java", "Spring Boot", "Go (Gin)", "FastAPI (Python)", "Node.js"]],
  ["database", ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Supabase"]],
  ["ai", [
    "LightGBM (LambdaMART)",
    { ko: "협업 필터링 (ALS)", ja: "協調フィルタリング (ALS)", en: "Collaborative filtering (ALS)" },
    "Whisper LoRA",
    { ko: "얼굴 인식 (CompreFace)", ja: "顔認識 (CompreFace)", en: "Face recognition (CompreFace)" },
  ]],
  ["infra", ["Docker", "GitHub Actions (self-hosted runner)", "AWS", "Vercel"]],
  ["other", ["Raspberry Pi", "Arduino", "C"]],
  ["tools", ["Git", "GitHub Projects", "Notion", "Slack", "Discord"]],
]

async function main() {
  const backupPath = process.argv[2]
  if (!backupPath) {
    console.error("✗ 백업 파일 경로를 주세요: npx tsx scripts/migrate-skills.ts <백업파일.json>")
    process.exit(1)
  }
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error("✗ MONGODB_URI 환경변수가 없습니다.")
    process.exit(1)
  }

  const client = await new MongoClient(uri).connect()
  try {
    const col = client.db(process.env.MONGODB_DB ?? "portfolio").collection("skills")
    const old = await col.find({}).toArray()
    if (old.some((d) => (skillCategory.options as string[]).includes(d.category))) {
      console.log("▶ 이미 새 묶음 문서가 있어 건너뜀")
      return
    }

    writeFileSync(backupPath, JSON.stringify(old, null, 2))
    console.log(`▶ 백업: ${old.length}개 → ${backupPath}`)

    const now = new Date()
    let order = 0
    const docs = GROUPS.flatMap(([category, names]) =>
      names.map((n) => ({
        ...skillInput.parse({
          order: order++,
          category,
          name: typeof n === "string" ? { ko: n, ja: n, en: n } : n,
          level: { ko: "" },
          published: true,
        }),
        createdAt: now,
        updatedAt: now,
      })),
    )
    const ins = await col.insertMany(docs)
    console.log(`▶ 새로 넣음: ${ins.insertedCount}개`)

    const del = await col.deleteMany({ _id: { $in: old.map((d) => d._id) } })
    console.log(`▶ 예전 문서 지움: ${del.deletedCount}개`)
  } finally {
    await client.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
