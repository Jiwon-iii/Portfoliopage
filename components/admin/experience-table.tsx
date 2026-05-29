"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { GripVertical, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Experience } from "@/lib/schemas/experience"

/**
 * 드래그로 순서 변경 가능한 경력 목록.
 * 핸들을 잡고 끌어서 위치 이동 → 놓으면 즉시 서버 저장 + 사이트 revalidate.
 */
export function ExperienceTable({ items: initial }: { items: Experience[] }) {
  const router = useRouter()
  const [items, setItems] = useState<Experience[]>(initial)
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

  async function persist(next: Experience[]) {
    const ids = next.map((e) => e._id)
    try {
      const res = await fetch("/api/experience/reorder", {
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
          {items.map((e, i) => {
            const isDragging = dragIdx === i
            const isOver = overIdx === i && dragIdx !== null && dragIdx !== i
            return (
              <TableRow
                key={e._id}
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
                  <Button asChild variant="ghost" size="sm" onClick={(ev) => ev.stopPropagation()}>
                    <Link href={`/admin/experience/${e._id}`}><Pencil className="h-3.5 w-3.5" /></Link>
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
