import { NextResponse, type NextRequest } from "next/server"
import { revalidatePath } from "next/cache"
import { listEducation, createEducation } from "@/lib/repo/education"
import { requireAdmin, handleZodError } from "@/lib/api-auth"

export async function GET() {
  return NextResponse.json(await listEducation())
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin()
  if (guard) return guard
  try {
    const doc = await createEducation(await req.json())
    revalidatePath("/", "layout")
    return NextResponse.json(doc, { status: 201 })
  } catch (err) {
    return handleZodError(err)
  }
}
