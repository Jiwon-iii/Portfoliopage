"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { I18nTabs } from "@/components/admin/i18n-tabs"
import { AdminLangBar } from "@/components/admin/admin-lang"
import type { Education } from "@/lib/schemas/education"

type I18nValue = { ko?: string | null; ja?: string | null; en?: string | null }

export function EducationForm({ education }: { education?: Education | null }) {
  const router = useRouter()
  const isEdit = !!education
  const [saving, setSaving] = useState(false)
  const [schoolName, setSchoolName] = useState<I18nValue>(education?.schoolName ?? { ko: "" })
  const [major, setMajor] = useState<I18nValue>(education?.major ?? { ko: "" })
  const [start, setStart] = useState(education?.period.start ?? "")
  const [end, setEnd] = useState(education?.period.end ?? "현재")
  const [note, setNote] = useState<I18nValue>(education?.note ?? { ko: "" })
  const [order, setOrder] = useState(education?.order ?? 0)
  const [published, setPublished] = useState(education?.published ?? true)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!schoolName.ko?.trim() || !start || !end) {
      toast.error("학교 이름·기간 필수")
      return
    }
    setSaving(true)
    try {
      const url = isEdit ? `/api/education/${education!._id}` : "/api/education"
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolName, major, period: { start, end }, note, order, published }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        toast.error(err.error || "저장 실패")
        return
      }
      toast.success(isEdit ? "수정 완료" : "추가 완료")
      router.push("/admin/education")
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  async function onDelete() {
    if (!isEdit || !confirm("정말 삭제할까요?")) return
    const res = await fetch(`/api/education/${education!._id}`, { method: "DELETE" })
    if (res.ok) {
      toast.success("삭제 완료")
      router.push("/admin/education")
      router.refresh()
    } else {
      toast.error("삭제 실패")
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-3xl">
      <AdminLangBar />
      <Card className="p-6 space-y-5">
        <I18nTabs label="학교 이름" required value={schoolName} onChange={(v) => setSchoolName(v)} />
        <I18nTabs label="전공 / 학과" value={major} onChange={(v) => setMajor(v)} />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>시작</Label>
            <Input value={start} onChange={(e) => setStart(e.target.value)} placeholder="2023 또는 2023-03" />
          </div>
          <div className="space-y-2">
            <Label>종료</Label>
            <Input value={end} onChange={(e) => setEnd(e.target.value)} placeholder="현재 또는 2025-02" />
          </div>
        </div>
        <I18nTabs label="비고 (선택)" multiline value={note} onChange={(v) => setNote(v)} />
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-center py-2">
          <div>
            <div className="font-semibold text-sm">사이트에 공개</div>
            <div className="text-xs text-muted-foreground">OFF 면 어드민에만 보임</div>
          </div>
          <Switch checked={published} onCheckedChange={setPublished} />
        </div>
        <div className="flex justify-between items-center py-2 border-t border-border">
          <div>
            <div className="font-semibold text-sm">정렬 순서</div>
          </div>
          <Input type="number" min={0} value={order} onChange={(e) => setOrder(Number(e.target.value) || 0)} className="w-24" />
        </div>
      </Card>

      <div className="flex justify-between sticky bottom-0 bg-background py-4 border-t border-border">
        {isEdit ? (
          <Button type="button" variant="ghost" onClick={onDelete} className="text-destructive">
            <Trash2 className="h-4 w-4" />
            삭제
          </Button>
        ) : (
          <span />
        )}
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            취소
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "저장 중..." : isEdit ? "저장" : "추가"}
          </Button>
        </div>
      </div>
    </form>
  )
}
