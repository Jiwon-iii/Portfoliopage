import { notFound } from "next/navigation"
import { AdminNavbar } from "@/components/admin/navbar"
import { EducationForm } from "@/components/admin/education-form"
import { getEducationById } from "@/lib/repo/education"

interface Props { params: Promise<{ id: string }> }

export default async function EditEducationPage({ params }: Props) {
  const { id } = await params
  const item = await getEducationById(id)
  if (!item) notFound()
  return (
    <>
      <AdminNavbar title={`편집: ${item.schoolName.ko}`} />
      <main className="max-w-4xl mx-auto px-8 py-8">
        <EducationForm education={item} />
      </main>
    </>
  )
}
