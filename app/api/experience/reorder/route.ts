import { NextResponse, type NextRequest } from "next/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { reorderExperience } from "@/lib/repo/experience"
import { requireAdmin, handleZodError } from "@/lib/api-auth"

export const dynamic = "force-dynamic"

const body = z.object({
  ids: z.array(z.string().min(1)).min(1),
})

export async function POST(req: NextRequest) {
  const guard = await requireAdmin()
  if (guard) return guard
  try {
    const { ids } = body.parse(await req.json())
    await reorderExperience(ids)
    revalidatePath("/", "layout")
    return NextResponse.json({ ok: true, count: ids.length })
  } catch (err) {
    return handleZodError(err)
  }
}
