/**
 * 진단용 — 모든 컬렉션을 재귀 스캔해서 ko는 있는데 ja가 빈 i18n 필드를 전부 찾는다.
 * 사용법: npx tsx scripts/scan-missing-ja.ts
 */
import { config } from "dotenv"
import { MongoClient } from "mongodb"

config({ path: ".env" })

const COLLECTIONS = ["about", "education", "experience", "hero", "settings", "skills", "works"]

// {ko, ja?, en?} 형태의 i18n 필드인지 판별
function isI18n(v: unknown): v is { ko?: unknown; ja?: unknown; en?: unknown } {
  return typeof v === "object" && v !== null && !Array.isArray(v) && "ko" in v
}

type Miss = { path: string; ko: string }

function walk(node: unknown, path: string, out: Miss[]) {
  if (Array.isArray(node)) {
    node.forEach((item, i) => walk(item, `${path}[${i}]`, out))
    return
  }
  if (typeof node !== "object" || node === null) return

  if (isI18n(node)) {
    const ko = typeof node.ko === "string" ? node.ko.trim() : ""
    const ja = typeof node.ja === "string" ? node.ja.trim() : ""
    if (ko && !ja) out.push({ path, ko })
    // i18n 필드 안에는 더 내려갈 게 없음
    return
  }

  for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
    walk(v, path ? `${path}.${k}` : k, out)
  }
}

async function main() {
  const uri = process.env.MONGODB_URI
  if (!uri) { console.error("✗ MONGODB_URI 없음"); process.exit(1) }
  const client = await new MongoClient(uri).connect()
  const db = client.db(process.env.MONGODB_DB ?? "portfolio")

  let total = 0
  for (const name of COLLECTIONS) {
    const docs = await db.collection(name).find({}).toArray()
    for (const d of docs) {
      const out: Miss[] = []
      const idLabel = d.slug ?? d._id
      walk(d, "", out)
      if (out.length) {
        console.log(`\n### ${name} / ${idLabel}`)
        for (const m of out) {
          console.log(`  [${m.path}]  ko="${m.ko.replace(/\n/g, "\\n").slice(0, 120)}"`)
          total++
        }
      }
    }
  }
  console.log(`\n총 미번역 ja 필드: ${total}개`)
  await client.close()
}

main().catch((e) => { console.error(e); process.exit(1) })
