import Link from "next/link"
import { Plus, Pencil } from "lucide-react"
import { AdminNavbar } from "@/components/admin/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { listSkills } from "@/lib/repo/skills"
import type { SkillCategory } from "@/lib/schemas/skill"

export const dynamic = "force-dynamic"

const CATEGORY_LABEL: Record<SkillCategory, string> = {
  main: "주력",
  usable: "활용",
}

export default async function SkillsAdminPage() {
  const items = await listSkills().catch(() => [])

  return (
    <>
      <AdminNavbar title="Skills" />
      <main className="max-w-6xl mx-auto px-8 py-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="font-serif text-3xl font-extrabold tracking-tight">사용 기술</h2>
            <p className="text-muted-foreground text-sm mt-1">주력 / 학습 중 / 호기심 영역 으로 분류.</p>
          </div>
          <Button asChild>
            <Link href="/admin/skills/new"><Plus className="h-4 w-4" />새 기술</Link>
          </Button>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">카테고리</TableHead>
                <TableHead className="w-16">정렬</TableHead>
                <TableHead>기술명</TableHead>
                <TableHead>수준</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                    아직 기술 항목이 없어요.
                  </TableCell>
                </TableRow>
              )}
              {items.map((s) => (
                <TableRow key={s._id}>
                  <TableCell className="font-mono text-[10px] text-primary tracking-wider">
                    {CATEGORY_LABEL[s.category]}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{s.order}</TableCell>
                  <TableCell className="font-serif font-semibold">{s.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{s.level?.ko || "—"}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-medium ${s.published ? "text-emerald-600" : "text-muted-foreground"}`}>
                      {s.published ? "● 공개" : "○ 숨김"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/skills/${s._id}`}><Pencil className="h-3.5 w-3.5" /></Link>
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
