import { notFound } from "next/navigation"
import { AdminNavbar } from "@/components/admin/navbar"
import { PrincipleForm } from "@/components/admin/principle-form"
import { getPrincipleById } from "@/lib/repo/principles"

export const dynamic = "force-dynamic"

interface Props { params: Promise<{ id: string }> }

export default async function EditPrinciplePage({ params }: Props) {
  const { id } = await params
  const item = await getPrincipleById(id)
  if (!item) notFound()
  return (
    <>
      <AdminNavbar title={`편집: ${item.title.ko}`} />
      <main className="max-w-3xl mx-auto px-8 py-8">
        <PrincipleForm principle={item} />
      </main>
    </>
  )
}
