import Link from "next/link"
import { Plus } from "lucide-react"
import { AdminNavbar } from "@/components/admin/navbar"
import { Button } from "@/components/ui/button"
import { ExperienceTable } from "@/components/admin/experience-table"
import { listExperience } from "@/lib/repo/experience"

export const dynamic = "force-dynamic"

export default async function ExperienceAdminPage() {
  const items = await listExperience(false).catch(() => [])

  return (
    <>
      <AdminNavbar title="Experience" />
      <main className="max-w-6xl mx-auto px-8 py-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="font-serif text-3xl font-extrabold tracking-tight">경력 · 활동</h2>
            <p className="text-muted-foreground text-sm mt-1">인턴 · 동아리 · 공모전 · 학교 프로젝트. 행을 드래그해 순서를 바꿉니다.</p>
          </div>
          <Button asChild>
            <Link href="/admin/experience/new"><Plus className="h-4 w-4" />새 항목</Link>
          </Button>
        </div>

        <ExperienceTable items={items} />
      </main>
    </>
  )
}
