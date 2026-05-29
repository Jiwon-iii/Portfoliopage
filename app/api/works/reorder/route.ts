import { NextResponse, type NextRequest } from "next/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { reorderWorks } from "@/lib/repo/works"
import { requireAdmin, handleZodError } from "@/lib/api-auth"

const body = z.object({
  ids: z.array(z.string().min(1)).min(1),
})

export async function POST(req: NextRequest) {
  const guard = await requireAdmin()
  if (guard) return guard
  try {
    const { ids } = body.parse(await req.json())
    await reorderWorks(ids)
    revalidatePath("/", "layout")
    return NextResponse.json({ ok: true, count: ids.length })
  } catch (err) {
    return handleZodError(err)
  }
}
