import Link from "next/link"
import { Plus, Pencil } from "lucide-react"
import { AdminNavbar } from "@/components/admin/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { listWorks } from "@/lib/repo/works"
import type { WorkType } from "@/lib/schemas/work"

export const dynamic = "force-dynamic"

const TYPE_LABEL: Record<WorkType, string> = {
  featured: "영웅",
  other: "프로젝트",
  practice: "연습",
  building: "진행 중",
}

const TABS: { value: WorkType | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "featured", label: "영웅" },
  { value: "other", label: "프로젝트" },
  { value: "practice", label: "그 외 (연습)" },
  { value: "building", label: "진행 중" },
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
      <AdminNavbar title="Works" />
      <main className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="font-serif text-3xl font-extrabold tracking-tight">작품 관리</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Featured · Other Works · Currently Building 다 여기서 관리.
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/works/new">
              <Plus className="h-4 w-4" />
              새 작품
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
                filter === t.value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
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

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">정렬</TableHead>
                <TableHead>제목 / slug</TableHead>
                <TableHead>분류</TableHead>
                <TableHead>기술</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">연도</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {works.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                    작품이 아직 없어요.{" "}
                    <Link href="/admin/works/new" className="text-primary underline">
                      새로 추가
                    </Link>
                  </TableCell>
                </TableRow>
              )}
              {works.map((w) => (
                <TableRow key={w._id} className="cursor-pointer">
                  <TableCell className="font-mono text-xs text-muted-foreground">{w.order}</TableCell>
                  <TableCell>
                    <div className="font-semibold text-sm">{w.title.ko}</div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">{w.slug}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={w.type === "featured" ? "default" : "outline"} className="font-mono text-[10px]">
                      {TYPE_LABEL[w.type]}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-[11px] text-muted-foreground">
                    {w.techs.slice(0, 3).join(" · ")}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        w.published ? "text-emerald-600" : "text-muted-foreground"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${w.published ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                      {w.published ? "공개" : "숨김"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-muted-foreground">{w.year ?? "—"}</TableCell>
                  <TableCell>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/works/${w._id}`}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>
    </>
  )
}
