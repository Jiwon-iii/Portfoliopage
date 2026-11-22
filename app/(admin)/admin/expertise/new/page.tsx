import { AdminNavbar } from "@/components/admin/navbar"
import { ExpertiseForm } from "@/components/admin/expertise-form"
import { listWorks } from "@/lib/repo/works"

export const dynamic = "force-dynamic"

export default async function NewExpertisePage() {
  const works = await listWorks({ publishedOnly: false }).catch(() => [])
  return (
    <>
      <AdminNavbar title="새 분야" />
      <main className="max-w-3xl mx-auto px-8 py-8">
        <ExpertiseForm works={works.map((w) => ({ _id: w._id, title: w.title.ko }))} />
      </main>
    </>
  )
}
