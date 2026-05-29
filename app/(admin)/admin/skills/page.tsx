import Link from "next/link"
import { Plus } from "lucide-react"
import { AdminNavbar } from "@/components/admin/navbar"
import { Button } from "@/components/ui/button"
import { SkillsTable } from "@/components/admin/skills-table"
import { listSkills } from "@/lib/repo/skills"

export const dynamic = "force-dynamic"

export default async function SkillsAdminPage() {
  const items = await listSkills(undefined, false).catch(() => [])

  return (
    <>
      <AdminNavbar title="Skills" />
      <main className="max-w-6xl mx-auto px-8 py-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="font-serif text-3xl font-extrabold tracking-tight">사용 기술</h2>
            <p className="text-muted-foreground text-sm mt-1">주력 / 활용 가능 영역으로 분류. 행을 드래그해 순서를 바꿉니다.</p>
          </div>
          <Button asChild>
            <Link href="/admin/skills/new"><Plus className="h-4 w-4" />새 기술</Link>
          </Button>
        </div>

        <SkillsTable items={items} />
      </main>
    </>
  )
}
