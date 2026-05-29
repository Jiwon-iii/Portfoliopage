import Link from "next/link"
import { Plus } from "lucide-react"
import { AdminNavbar } from "@/components/admin/navbar"
import { Button } from "@/components/ui/button"
import { EducationTable } from "@/components/admin/education-table"
import { listEducation } from "@/lib/repo/education"

export const dynamic = "force-dynamic"

export default async function EducationAdminPage() {
  const items = await listEducation(false).catch(() => [])

  return (
    <>
      <AdminNavbar title="Education" />
      <main className="max-w-6xl mx-auto px-8 py-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="font-serif text-3xl font-extrabold tracking-tight">학력</h2>
            <p className="text-muted-foreground text-sm mt-1">교육 배경 타임라인. 행을 드래그해 순서를 바꿉니다.</p>
          </div>
          <Button asChild>
            <Link href="/admin/education/new"><Plus className="h-4 w-4" />새 항목</Link>
          </Button>
        </div>

        <EducationTable items={items} />
      </main>
    </>
  )
}
