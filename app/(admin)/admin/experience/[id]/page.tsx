import { notFound } from "next/navigation"
import { AdminNavbar } from "@/components/admin/navbar"
import { ExperienceForm } from "@/components/admin/experience-form"
import { getExperienceById } from "@/lib/repo/experience"

interface Props { params: Promise<{ id: string }> }

export default async function EditExperiencePage({ params }: Props) {
  const { id } = await params
  const item = await getExperienceById(id)
  if (!item) notFound()
  return (
    <>
      <AdminNavbar title={`편집: ${item.title.ko}`} />
      <main className="max-w-4xl mx-auto px-8 py-8">
        <ExperienceForm experience={item} />
      </main>
    </>
  )
}
