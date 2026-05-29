import { NextResponse, type NextRequest } from "next/server"
import { revalidatePath } from "next/cache"
import { getEducationById, updateEducation, deleteEducation } from "@/lib/repo/education"
import { requireAdmin, handleZodError } from "@/lib/api-auth"

interface Ctx { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params
  const doc = await getEducationById(id)
  if (!doc) return NextResponse.json({ error: "찾을 수 없음" }, { status: 404 })
  return NextResponse.json(doc)
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const guard = await requireAdmin()
  if (guard) return guard
  const { id } = await params
  try {
    const doc = await updateEducation(id, await req.json())
    if (!doc) return NextResponse.json({ error: "찾을 수 없음" }, { status: 404 })
    revalidatePath("/", "layout")
    return NextResponse.json(doc)
  } catch (err) {
    return handleZodError(err)
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const guard = await requireAdmin()
  if (guard) return guard
  const { id } = await params
  const ok = await deleteEducation(id)
  if (!ok) return NextResponse.json({ error: "찾을 수 없음" }, { status: 404 })
  revalidatePath("/", "layout")
  return NextResponse.json({ ok: true })
}
