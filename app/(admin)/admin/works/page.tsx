import Link from "next/link"
import { Plus } from "lucide-react"
import { AdminNavbar } from "@/components/admin/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { WorksTable } from "@/components/admin/works-table"
import { listWorks } from "@/lib/repo/works"
import type { WorkType } from "@/lib/schemas/work"

export const dynamic = "force-dynamic"

const TABS: { value: WorkType | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "general", label: "일반" },
  { value: "practice", label: "연습" },
]

interface Props {
  searchParams: Promise<{ type?: string }>
}

export default async function WorksAdminPage({ searchParams }: Props) {
  const sp = await searchParams
  const filter = (TABS.find((t) => t.value === sp.type)?.value ?? "all") as WorkType | "all"

  let works: Awaited<ReturnType<typeof listWorks>> = []
  let dbError = false
  try {
    works = await listWorks({ publishedOnly: false, ...(filter !== "all" ? { type: filter } : {}) })
  } catch {
    dbError = true
  }

  return (
    <>
      <AdminNavbar title="프로젝트" />
      <main className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="font-serif text-3xl font-extrabold tracking-tight">프로젝트 관리</h2>
            <p className="text-muted-foreground text-sm mt-1">
              일반 · 연습 모두 여기서 관리. 진행 상태는 각 항목 안에서 설정. 행을 끌어서 순서 변경.
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/works/new">
              <Plus className="h-4 w-4" />새 프로젝트
            </Link>
          </Button>
        </div>

        {/* 필터 탭 */}
        <div className="inline-flex bg-secondary rounded-md p-1 gap-0.5 mb-4">
          {TABS.map((t) => (
            <Link
              key={t.value}
              href={t.value === "all" ? "/admin/works" : `/admin/works?type=${t.value}`}
              className={`px-3.5 py-1.5 rounded text-xs font-medium transition-colors ${
                filter === t.value
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>

        {dbError && (
          <Card className="p-6 mb-4 border-destructive/40 bg-destructive/5">
            <div className="font-semibold text-destructive">DB 연결 실패</div>
            <div className="text-sm text-muted-foreground mt-1">
              <code className="font-mono">MONGODB_URI</code> 확인 또는 Atlas 네트워크 접근 허용 여부 확인.
            </div>
          </Card>
        )}

        <WorksTable works={works} />
      </main>
    </>
  )
}
