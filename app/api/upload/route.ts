import { NextResponse, type NextRequest } from "next/server"
import { put } from "@vercel/blob"
import { requireAdmin } from "@/lib/api-auth"

const MAX_BYTES = 5 * 1024 * 1024 // 5MB
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif"]

export async function POST(req: NextRequest) {
  const guard = await requireAdmin()
  if (guard) return guard

  const form = await req.formData()
  const file = form.get("file")

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "파일이 없습니다" }, { status: 400 })
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "지원하지 않는 형식 (PNG/JPG/WebP/GIF)" }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "최대 5MB" }, { status: 400 })
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN 환경변수 미설정. Vercel 대시보드에서 발급 필요." },
      { status: 500 },
    )
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
  const blob = await put(`portfolio/${Date.now()}-${safeName}`, file, {
    access: "public",
    addRandomSuffix: true,
  })

  return NextResponse.json({ url: blob.url, pathname: blob.pathname })
}
