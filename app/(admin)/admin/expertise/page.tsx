import Link from "next/link"
import { Plus } from "lucide-react"
import { AdminNavbar } from "@/components/admin/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { listExpertise } from "@/lib/repo/expertise"

export const dynamic = "force-dynamic"

export default async function ExpertiseAdminPage() {
  const items = await listExpertise(false).catch(() => [])

  return (
    <>
      <AdminNavbar title="분야" />
      <main className="max-w-6xl mx-auto px-8 py-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="font-serif text-3xl font-extrabold tracking-tight">분야 (Web · AI · Server)</h2>
            <p className="text-muted-foreground text-sm mt-1">메인 · 위쪽 「分野」 메뉴 · 分野 페이지에 나오는 분야. 보통 3개 (배너 그림은 앞의 3개까지 표시).</p>
          </div>
          <Button asChild>
            <Link href="/admin/expertise/new"><Plus className="h-4 w-4" />새 분야</Link>
          </Button>
        </div>

        {/* 순서는 각 항목 편집 화면의 「순서」 숫자로 정함 */}
        <Card className="divide-y divide-border py-0 gap-0 overflow-hidden">
          {items.length === 0 && (
            <p className="text-center text-muted-foreground py-12 text-sm">아직 분야가 없어요. 사이트에는 기본 3개(Web · AI · Server)가 대신 나옵니다. 하나라도 만들면(숨김 포함) 기본값은 사라집니다.</p>
          )}
          {items.map((it) => (
            <Link
              key={it._id}
              href={`/admin/expertise/${it._id}`}
              className="flex items-center gap-4 px-6 py-4 hover:bg-accent transition-colors"
            >
              <span className="w-8 font-mono text-xs text-muted-foreground">{it.order}</span>
              <span className="flex-1 min-w-0">
                <span className="font-serif font-semibold">{it.title?.ko || "—"}</span>
                {it.title?.ja && <span className="ml-2 text-sm text-muted-foreground">{it.title.ja}</span>}
              </span>
              <span className={`text-xs font-medium ${it.published ? "text-emerald-600" : "text-muted-foreground"}`}>
                {it.published ? "● 공개" : "○ 숨김"}
              </span>
            </Link>
          ))}
        </Card>
      </main>
    </>
  )
}
