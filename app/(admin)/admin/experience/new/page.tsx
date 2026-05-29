import { AdminNavbar } from "@/components/admin/navbar"
import { ExperienceForm } from "@/components/admin/experience-form"

export default function NewExperiencePage() {
  return (
    <>
      <AdminNavbar title="새 경력" />
      <main className="max-w-4xl mx-auto px-8 py-8">
        <ExperienceForm />
      </main>
    </>
  )
}
