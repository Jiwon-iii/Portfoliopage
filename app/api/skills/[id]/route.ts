import { NextResponse, type NextRequest } from "next/server"
import { revalidatePath } from "next/cache"
import { getSkillById, updateSkill, deleteSkill } from "@/lib/repo/skills"
import { requireAdmin, handleZodError } from "@/lib/api-auth"

export const dynamic = "force-dynamic"

interface Ctx { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params
  const doc = await getSkillById(id)
  if (!doc) return NextResponse.json({ error: "찾을 수 없음" }, { status: 404 })
  return NextResponse.json(doc)
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const guard = await requireAdmin()
  if (guard) return guard
  const { id } = await params
  try {
    const doc = await updateSkill(id, await req.json())
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
  const ok = await deleteSkill(id)
  if (!ok) return NextResponse.json({ error: "찾을 수 없음" }, { status: 404 })
  revalidatePath("/", "layout")
  return NextResponse.json({ ok: true })
}
