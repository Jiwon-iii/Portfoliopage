import { notFound } from "next/navigation"
import { AdminNavbar } from "@/components/admin/navbar"
import { ExpertiseForm } from "@/components/admin/expertise-form"
import { getExpertiseById } from "@/lib/repo/expertise"
import { listWorks } from "@/lib/repo/works"

export const dynamic = "force-dynamic"

interface Props { params: Promise<{ id: string }> }

export default async function EditExpertisePage({ params }: Props) {
  const { id } = await params
  const [item, works] = await Promise.all([
    getExpertiseById(id),
    listWorks({ publishedOnly: false }).catch(() => []),
  ])
  if (!item) notFound()
  return (
    <>
      <AdminNavbar title={`편집: ${item.title.ko}`} />
      <main className="max-w-3xl mx-auto px-8 py-8">
        <ExpertiseForm expertise={item} works={works.map((w) => ({ _id: w._id, title: w.title.ko }))} />
      </main>
    </>
  )
}
