import { getIronSession, type SessionOptions } from "iron-session"
import { cookies } from "next/headers"

export interface AdminSession {
  isAdmin?: true
  loggedInAt?: number
}

const password = process.env.SESSION_SECRET
if (!password || password.length < 32) {
  // 빌드 시점엔 빈 문자열일 수 있으니 런타임에만 throw
  if (process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build") {
    throw new Error("SESSION_SECRET 환경변수는 32자 이상이어야 합니다.")
  }
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET ?? "x".repeat(32),
  cookieName: "portfolio_admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30일
    path: "/",
  },
}

export async function getSession() {
  const cookieStore = await cookies()
  return getIronSession<AdminSession>(cookieStore, sessionOptions)
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session.isAdmin === true
}

/** 어드민 비밀번호 검증. */
export function verifyAdminPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  return input === expected
}
