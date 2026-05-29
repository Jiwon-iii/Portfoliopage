import { NextResponse, type NextRequest } from "next/server"
import { revalidatePath } from "next/cache"
import { getHero, upsertHero } from "@/lib/repo/hero"
import { requireAdmin, handleZodError } from "@/lib/api-auth"

export async function GET() {
  return NextResponse.json(await getHero())
}

export async function PATCH(req: NextRequest) {
  const guard = await requireAdmin()
  if (guard) return guard
  try {
    const doc = await upsertHero(await req.json())
    revalidatePath("/", "layout")
    return NextResponse.json(doc)
  } catch (err) {
    return handleZodError(err)
  }
}
