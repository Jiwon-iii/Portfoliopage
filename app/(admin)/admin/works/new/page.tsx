import { AdminNavbar } from "@/components/admin/navbar"
import { WorkForm } from "@/components/admin/work-form"

export default function NewWorkPage() {
  return (
    <>
      <AdminNavbar title="새 프로젝트" />
      <main className="max-w-5xl mx-auto px-8 py-8">
        <WorkForm />
      </main>
    </>
  )
}
