import { NextResponse, type NextRequest } from "next/server"
import { revalidatePath } from "next/cache"
import { listWorks, createWork } from "@/lib/repo/works"
import { requireAdmin, handleZodError } from "@/lib/api-auth"
import { workType } from "@/lib/schemas/work"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const typeParam = req.nextUrl.searchParams.get("type")
  const parsedType = typeParam ? workType.safeParse(typeParam) : null
  const works = await listWorks({ type: parsedType?.success ? parsedType.data : undefined })
  return NextResponse.json(works)
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin()
  if (guard) return guard

  try {
    const body = await req.json()
    const work = await createWork(body)
    revalidatePath("/", "layout")
    return NextResponse.json(work, { status: 201 })
  } catch (err) {
    return handleZodError(err)
  }
}
