import { NextResponse, type NextRequest } from "next/server"
import { getIronSession } from "iron-session"
import { sessionOptions, type AdminSession } from "@/lib/auth"

/**
 * 어드민 경로 보호 미들웨어.
 * - /admin/* 접근 시 세션 검증
 * - 미인증 시 /login 으로 redirect (원래 가려던 곳을 ?from= 으로)
 * - /login 은 이미 인증된 상태면 /admin 으로 redirect (불필요한 로그인 폼 노출 방지)
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isAdminPath = pathname.startsWith("/admin")
  const isLoginPath = pathname === "/login"

  if (!isAdminPath && !isLoginPath) {
    return NextResponse.next()
  }

  // 세션 검증 (Edge runtime 호환 — iron-session 은 Edge 지원)
  const res = NextResponse.next()
  const session = await getIronSession<AdminSession>(req, res, sessionOptions)

  if (isAdminPath && !session.isAdmin) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isLoginPath && session.isAdmin) {
    return NextResponse.redirect(new URL("/admin", req.url))
  }

  return res
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
}
