"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { GripVertical, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Skill, SkillCategory } from "@/lib/schemas/skill"

const CATEGORY_LABEL: Record<SkillCategory, string> = {
  main: "주력",
  usable: "활용",
}

/**
 * 드래그로 순서 변경 가능한 기술 목록.
 * 핸들을 잡고 끌어서 위치 이동 → 놓으면 즉시 서버 저장 + 사이트 revalidate.
 * (사이트는 카테고리별로 묶어 보여주므로, 같은 카테고리 안에서의 상대 순서가 유지됩니다.)
 */
export function SkillsTable({ items: initial }: { items: Skill[] }) {
  const router = useRouter()
  const [items, setItems] = useState<Skill[]>(initial)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [overIdx, setOverIdx] = useState<number | null>(null)
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    setItems(initial)
  }, [initial])

  function move(from: number, to: number) {
    if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) return
    const next = items.slice()
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    setItems(next)
    persist(next)
  }

  async function persist(next: Skill[]) {
    const ids = next.map((s) => s._id)
    try {
      const res = await fetch("/api/skills/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        toast.error(err.error || "순서 저장 실패")
        return
      }
      toast.success("순서 저장됨")
      startTransition(() => router.refresh())
    } catch {
      toast.error("네트워크 오류")
    }
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead className="w-20">카테고리</TableHead>
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
          {items.map((s, i) => {
            const isDragging = dragIdx === i
            const isOver = overIdx === i && dragIdx !== null && dragIdx !== i
            return (
              <TableRow
                key={s._id}
                draggable
                onDragStart={(ev) => {
                  setDragIdx(i)
                  ev.dataTransfer.effectAllowed = "move"
                }}
                onDragOver={(ev) => {
                  ev.preventDefault()
                  setOverIdx(i)
                }}
                onDragLeave={() => setOverIdx((v) => (v === i ? null : v))}
                onDrop={(ev) => {
                  ev.preventDefault()
                  if (dragIdx !== null) move(dragIdx, i)
                  setDragIdx(null)
                  setOverIdx(null)
                }}
                onDragEnd={() => {
                  setDragIdx(null)
                  setOverIdx(null)
                }}
                className={
                  "cursor-move transition-colors " +
                  (isDragging ? "opacity-40 " : "") +
                  (isOver ? "bg-primary/5 " : "") +
                  (pending ? "pointer-events-none " : "")
                }
              >
                <TableCell className="text-muted-foreground">
                  <GripVertical className="h-4 w-4" />
                </TableCell>
                <TableCell className="font-mono text-[10px] text-primary tracking-wider">
                  {CATEGORY_LABEL[s.category]}
                </TableCell>
                <TableCell className="font-serif font-semibold">{s.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{s.level?.ko || "—"}</TableCell>
                <TableCell>
                  <span className={`text-xs font-medium ${s.published ? "text-emerald-600" : "text-muted-foreground"}`}>
                    {s.published ? "● 공개" : "○ 숨김"}
                  </span>
                </TableCell>
                <TableCell>
                  <Button asChild variant="ghost" size="sm" onClick={(ev) => ev.stopPropagation()}>
                    <Link href={`/admin/skills/${s._id}`}><Pencil className="h-3.5 w-3.5" /></Link>
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Card>
  )
}
