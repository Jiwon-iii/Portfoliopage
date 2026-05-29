import { NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { ZodError } from "zod"

/**
 * 어드민 전용 라우트 가드. 미인증 시 401 반환.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "인증 필요" }, { status: 401 })
  }
  return null
}

/**
 * Zod 에러 → 400 응답 변환.
 */
export function handleZodError(err: unknown): NextResponse {
  if (err instanceof ZodError) {
    return NextResponse.json({ error: "입력값이 올바르지 않습니다", issues: err.issues }, { status: 400 })
  }
  console.error(err)
  return NextResponse.json({ error: "서버 오류" }, { status: 500 })
}
