import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"
import { getSession, verifyAdminPassword } from "@/lib/auth"

const loginInput = z.object({ password: z.string().min(1) })

export async function POST(req: NextRequest) {
  let parsed
  try {
    parsed = loginInput.parse(await req.json())
  } catch {
    return NextResponse.json({ error: "비밀번호를 입력해주세요" }, { status: 400 })
  }

  if (!verifyAdminPassword(parsed.password)) {
    // 무차별 대입 방지를 위한 최소 지연
    await new Promise((r) => setTimeout(r, 800))
    return NextResponse.json({ error: "비밀번호가 일치하지 않습니다" }, { status: 401 })
  }

  const session = await getSession()
  session.isAdmin = true
  session.loggedInAt = Date.now()
  await session.save()

  return NextResponse.json({ ok: true })
}
