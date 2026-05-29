import { notFound } from "next/navigation"
import { AdminNavbar } from "@/components/admin/navbar"
import { SkillForm } from "@/components/admin/skill-form"
import { getSkillById } from "@/lib/repo/skills"

interface Props { params: Promise<{ id: string }> }

export default async function EditSkillPage({ params }: Props) {
  const { id } = await params
  const item = await getSkillById(id)
  if (!item) notFound()
  return (
    <>
      <AdminNavbar title={`편집: ${item.name}`} />
      <main className="max-w-3xl mx-auto px-8 py-8">
        <SkillForm skill={item} />
      </main>
    </>
  )
}
