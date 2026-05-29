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
import type { Skill, SkillCategory } from "@/lib/schemas/skill"

type I18nValue = { ko?: string | null; ja?: string | null; en?: string | null }

export function SkillForm({ skill }: { skill?: Skill | null }) {
  const router = useRouter()
  const isEdit = !!skill
  const [saving, setSaving] = useState(false)
  const [category, setCategory] = useState<SkillCategory>(skill?.category ?? "main")
  const [name, setName] = useState(skill?.name ?? "")
  const [level, setLevel] = useState<I18nValue>(skill?.level ?? { ko: "" })
  const [published, setPublished] = useState(skill?.published ?? true)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("기술명 필수")
      return
    }
    setSaving(true)
    try {
      const url = isEdit ? `/api/skills/${skill!._id}` : "/api/skills"
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, name, level, published }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        toast.error(err.error || "저장 실패")
        return
      }
      toast.success(isEdit ? "수정 완료" : "추가 완료")
      router.push("/admin/skills")
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  async function onDelete() {
    if (!isEdit || !confirm("정말 삭제할까요?")) return
    const res = await fetch(`/api/skills/${skill!._id}`, { method: "DELETE" })
    if (res.ok) {
      toast.success("삭제 완료")
      router.push("/admin/skills")
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
          <Label>카테고리</Label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as SkillCategory)}
            className="w-full h-9 px-3 border border-input rounded-md bg-background text-sm"
          >
            <option value="main">주력 스택</option>
            <option value="usable">활용 가능 스택</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">기술명 <span className="text-primary text-xs font-mono ml-1">필수</span></Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Next.js" />
          <p className="text-xs text-muted-foreground">영문 그대로 (예: Next.js, TypeScript, MongoDB)</p>
        </div>
        <I18nTabs label="수준 라벨" hint="예: 능숙 / 실무 / 진행" value={level} onChange={(v) => setLevel(v)} />
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
