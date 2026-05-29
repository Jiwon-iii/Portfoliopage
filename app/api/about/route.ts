import { NextResponse, type NextRequest } from "next/server"
import { revalidatePath } from "next/cache"
import { getAbout, upsertAbout } from "@/lib/repo/about"
import { requireAdmin, handleZodError } from "@/lib/api-auth"

export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json(await getAbout())
}

export async function PATCH(req: NextRequest) {
  const guard = await requireAdmin()
  if (guard) return guard
  try {
    const doc = await upsertAbout(await req.json())
    revalidatePath("/", "layout")
    return NextResponse.json(doc)
  } catch (err) {
    return handleZodError(err)
  }
}
