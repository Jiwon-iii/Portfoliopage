import Link from "next/link"
import { Plus, Pencil } from "lucide-react"
import { AdminNavbar } from "@/components/admin/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
            <p className="text-muted-foreground text-sm mt-1">인턴 · 동아리 · 공모전 · 학교 프로젝트.</p>
          </div>
          <Button asChild>
            <Link href="/admin/experience/new"><Plus className="h-4 w-4" />새 항목</Link>
          </Button>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">정렬</TableHead>
                <TableHead>역할 / 기관</TableHead>
                <TableHead>기간</TableHead>
                <TableHead>기술</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                    아직 경력 항목이 없어요.
                  </TableCell>
                </TableRow>
              )}
              {items.map((e) => (
                <TableRow key={e._id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{e.order}</TableCell>
                  <TableCell>
                    <div className="font-semibold text-sm">{e.title.ko}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{e.orgName?.ko || ""}</div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{e.period.start} — {e.period.end}</TableCell>
                  <TableCell className="font-mono text-[11px] text-muted-foreground">{e.techs.slice(0, 3).join(" · ")}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-medium ${e.published ? "text-emerald-600" : "text-muted-foreground"}`}>
                      {e.published ? "● 공개" : "○ 숨김"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/experience/${e._id}`}><Pencil className="h-3.5 w-3.5" /></Link>
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
