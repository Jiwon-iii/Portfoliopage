import { AdminNavbar } from "@/components/admin/navbar"
import { SkillForm } from "@/components/admin/skill-form"

export default function NewSkillPage() {
  return (
    <>
      <AdminNavbar title="새 기술" />
      <main className="max-w-3xl mx-auto px-8 py-8">
        <SkillForm />
      </main>
    </>
  )
}
