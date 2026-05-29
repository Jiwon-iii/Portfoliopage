import { AdminNavbar } from "@/components/admin/navbar"
import { EducationForm } from "@/components/admin/education-form"

export default function NewEducationPage() {
  return (
    <>
      <AdminNavbar title="새 학력" />
      <main className="max-w-4xl mx-auto px-8 py-8">
        <EducationForm />
      </main>
    </>
  )
}
