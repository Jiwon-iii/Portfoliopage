import { NextResponse, type NextRequest } from "next/server"
import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/api-auth"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const guard = await requireAdmin()
  if (guard) return guard

  const { searchParams } = req.nextUrl
  const path = searchParams.get("path") || "/"
  const type = (searchParams.get("type") as "page" | "layout") || "layout"

  revalidatePath(path, type)
  return NextResponse.json({ ok: true, revalidated: path, type })
}
