import { AdminNavbar } from "@/components/admin/navbar"
import { PrincipleForm } from "@/components/admin/principle-form"

export const dynamic = "force-dynamic"

export default function NewPrinciplePage() {
  return (
    <>
      <AdminNavbar title="새 가치" />
      <main className="max-w-3xl mx-auto px-8 py-8">
        <PrincipleForm />
      </main>
    </>
  )
}
