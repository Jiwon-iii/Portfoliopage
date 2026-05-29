import { notFound } from "next/navigation"
import { AdminNavbar } from "@/components/admin/navbar"
import { WorkForm } from "@/components/admin/work-form"
import { getWorkById } from "@/lib/repo/works"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditWorkPage({ params }: Props) {
  const { id } = await params
  const work = await getWorkById(id)
  if (!work) notFound()

  return (
    <>
      <AdminNavbar title={`편집: ${work.title.ko}`} />
      <main className="max-w-5xl mx-auto px-8 py-8">
        <WorkForm work={work} />
      </main>
    </>
  )
}
