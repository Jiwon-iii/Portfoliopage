import { NextResponse, type NextRequest } from "next/server"
import { revalidatePath } from "next/cache"
import { listSkills, createSkill } from "@/lib/repo/skills"
import { requireAdmin, handleZodError } from "@/lib/api-auth"
import { skillCategory } from "@/lib/schemas/skill"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const catParam = req.nextUrl.searchParams.get("category")
  const parsed = catParam ? skillCategory.safeParse(catParam) : null
  return NextResponse.json(await listSkills(parsed?.success ? parsed.data : undefined))
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin()
  if (guard) return guard
  try {
    const doc = await createSkill(await req.json())
    revalidatePath("/", "layout")
    return NextResponse.json(doc, { status: 201 })
  } catch (err) {
    return handleZodError(err)
  }
}
