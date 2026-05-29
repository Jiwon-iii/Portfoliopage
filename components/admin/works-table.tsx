"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { GripVertical, Pencil } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Work, WorkType } from "@/lib/schemas/work"

const TYPE_LABEL: Record<WorkType, string> = {
  general: "일반",
  practice: "연습",
}

/**
 * 드래그로 순서 변경 가능한 프로젝트 목록.
 * - 드래그 핸들 잡고 끌어서 위치 이동
 * - 놓으면 즉시 서버에 새 순서 저장 + 메인 사이트 revalidate
 * - 낙관적 업데이트 (실패 시 toast 만 띄움)
 */
export function WorksTable({ works }: { works: Work[] }) {
  const router = useRouter()
  const [items, setItems] = useState<Work[]>(works)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [overIdx, setOverIdx] = useState<number | null>(null)
  const [pending, startTransition] = useTransition()

  // 부모로부터 새 props 가 들어오면 state 동기화 (추가/삭제 후 router.refresh 등)
  useEffect(() => {
    setItems(works)
  }, [works])

  function move(from: number, to: number) {
    if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) return
    const next = items.slice()
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    setItems(next)
    persist(next)
  }

  async function persist(next: Work[]) {
    const ids = next.map((w) => w._id)
    try {
      const res = await fetch("/api/works/reorder", {
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

  if (items.length === 0) {
    return (
      <Card>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="text-center text-muted-foreground py-12">
                프로젝트가 아직 없어요.{" "}
                <Link href="/admin/works/new" className="text-primary underline">
                  새로 추가
                </Link>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    )
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead className="w-12">순서</TableHead>
            <TableHead>제목 / slug</TableHead>
            <TableHead>분류</TableHead>
            <TableHead>기술</TableHead>
            <TableHead>상태</TableHead>
            <TableHead className="text-right">연도</TableHead>
            <TableHead className="w-20"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((w, i) => {
            const isDragging = dragIdx === i
            const isOver = overIdx === i && dragIdx !== null && dragIdx !== i
            return (
              <TableRow
                key={w._id}
                draggable
                onDragStart={(e) => {
                  setDragIdx(i)
                  e.dataTransfer.effectAllowed = "move"
                }}
                onDragOver={(e) => {
                  e.preventDefault()
                  setOverIdx(i)
                }}
                onDragLeave={() => setOverIdx((v) => (v === i ? null : v))}
                onDrop={(e) => {
                  e.preventDefault()
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
                <TableCell className="font-mono text-xs text-muted-foreground">{i + 1}</TableCell>
                <TableCell>
                  <div className="font-semibold text-sm">{w.title.ko}</div>
                  <div className="text-xs text-muted-foreground font-mono mt-0.5">{w.slug}</div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge
                      variant={w.type === "general" ? "default" : "outline"}
                      className="font-mono text-[10px] w-fit"
                    >
                      {TYPE_LABEL[w.type]}
                    </Badge>
                    {w.status === "in-progress" && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-primary tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        진행 중
                      </span>
                    )}
                  </div>
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
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        w.published ? "bg-emerald-500" : "bg-muted-foreground"
                      }`}
                    />
                    {w.published ? "공개" : "숨김"}
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono text-xs text-muted-foreground">
                  {w.year ?? "—"}
                </TableCell>
                <TableCell>
                  <Button asChild variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                    <Link href={`/admin/works/${w._id}`}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
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
