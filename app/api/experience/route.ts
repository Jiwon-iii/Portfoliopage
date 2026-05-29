import { NextResponse, type NextRequest } from "next/server"
import { revalidatePath } from "next/cache"
import { listExperience, createExperience } from "@/lib/repo/experience"
import { requireAdmin, handleZodError } from "@/lib/api-auth"

export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json(await listExperience())
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin()
  if (guard) return guard
  try {
    const doc = await createExperience(await req.json())
    revalidatePath("/", "layout")
    return NextResponse.json(doc, { status: 201 })
  } catch (err) {
    return handleZodError(err)
  }
}
