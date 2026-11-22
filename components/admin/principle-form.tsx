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
import type { Principle } from "@/lib/schemas/principle"

type I18nValue = { ko?: string | null; ja?: string | null; en?: string | null }

export function PrincipleForm({ principle }: { principle?: Principle | null }) {
  const router = useRouter()
  const isEdit = !!principle
  const [saving, setSaving] = useState(false)
  const [order, setOrder] = useState(principle?.order ?? 0)
  const [title, setTitle] = useState<I18nValue>(principle?.title ?? { ko: "" })
  const [body, setBody] = useState<I18nValue>(principle?.body ?? { ko: "" })
  const [published, setPublished] = useState(principle?.published ?? true)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.ko?.trim()) {
      toast.error("제목(한국어) 필수")
      return
    }
    setSaving(true)
    try {
      const url = isEdit ? `/api/principles/${principle!._id}` : "/api/principles"
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order, title, body, published }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        toast.error(err.error || "저장 실패")
        return
      }
      toast.success(isEdit ? "수정 완료" : "추가 완료")
      router.push("/admin/principles")
      router.refresh()
    } catch {
      toast.error("네트워크 오류")
    } finally {
      setSaving(false)
    }
  }

  async function onDelete() {
    if (!isEdit || !confirm("정말 삭제할까요?")) return
    const res = await fetch(`/api/principles/${principle!._id}`, { method: "DELETE" })
    if (res.ok) {
      toast.success("삭제 완료")
      router.push("/admin/principles")
      router.refresh()
    } else {
      toast.error("삭제 실패")
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      <AdminLangBar />
      <Card className="p-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="order">순서</Label>
          <Input
            id="order"
            type="number"
            min={0}
            step={1}
            value={order}
            onChange={(e) => setOrder(Math.max(0, Math.floor(Number(e.target.value) || 0)))}
            className="w-32"
          />
          <p className="text-xs text-muted-foreground">작은 숫자가 먼저 나옵니다.</p>
        </div>
        <I18nTabs label="제목" required value={title} onChange={setTitle} />
        <I18nTabs label="본문" hint="실제 경험 한두 문장" multiline value={body} onChange={setBody} />
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-center py-2">
          <div className="font-semibold text-sm">공개</div>
          <Switch checked={published} onCheckedChange={setPublished} />
        </div>
      </Card>

      <div className="flex justify-between sticky bottom-0 bg-background py-4 border-t border-border">
        {isEdit ? (
          <Button type="button" variant="ghost" onClick={onDelete} className="text-destructive">
            <Trash2 className="h-4 w-4" />
            삭제
          </Button>
        ) : <span />}
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>취소</Button>
          <Button type="submit" disabled={saving}>{saving ? "저장 중..." : isEdit ? "저장" : "추가"}</Button>
        </div>
      </div>
    </form>
  )
}
