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
import { TagInput } from "@/components/admin/tag-input"
import type { Experience } from "@/lib/schemas/experience"

type I18nValue = { ko?: string | null; ja?: string | null; en?: string | null }

export function ExperienceForm({ experience }: { experience?: Experience | null }) {
  const router = useRouter()
  const isEdit = !!experience
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState<I18nValue>(experience?.title ?? { ko: "" })
  const [orgName, setOrgName] = useState<I18nValue>(experience?.orgName ?? { ko: "" })
  const [start, setStart] = useState(experience?.period.start ?? "")
  const [end, setEnd] = useState(experience?.period.end ?? "현재")
  const [techs, setTechs] = useState<string[]>(experience?.techs ?? [])
  const [description, setDescription] = useState<I18nValue>(experience?.description ?? { ko: "" })
  const [published, setPublished] = useState(experience?.published ?? true)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.ko?.trim() || !start || !end) {
      toast.error("역할명·기간 필수")
      return
    }
    setSaving(true)
    try {
      const url = isEdit ? `/api/experience/${experience!._id}` : "/api/experience"
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, orgName, period: { start, end }, techs, description, published }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        toast.error(err.error || "저장 실패")
        return
      }
      toast.success(isEdit ? "수정 완료" : "추가 완료")
      router.push("/admin/experience")
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  async function onDelete() {
    if (!isEdit || !confirm("정말 삭제할까요?")) return
    const res = await fetch(`/api/experience/${experience!._id}`, { method: "DELETE" })
    if (res.ok) {
      toast.success("삭제 완료")
      router.push("/admin/experience")
      router.refresh()
    } else {
      toast.error("삭제 실패")
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-3xl">
      <AdminLangBar />
      <Card className="p-6 space-y-5">
        <I18nTabs label="역할 / 활동명" required value={title} onChange={(v) => setTitle(v)} />
        <I18nTabs label="회사 / 동아리 / 기관" value={orgName} onChange={(v) => setOrgName(v)} />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>시작</Label>
            <Input value={start} onChange={(e) => setStart(e.target.value)} placeholder="2024" />
          </div>
          <div className="space-y-2">
            <Label>종료</Label>
            <Input value={end} onChange={(e) => setEnd(e.target.value)} placeholder="현재 또는 2025" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>사용 기술</Label>
          <TagInput value={techs} onChange={setTechs} />
        </div>
        <I18nTabs label="설명" multiline value={description} onChange={(v) => setDescription(v)} />
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-center py-2">
          <div>
            <div className="font-semibold text-sm">공개</div>
          </div>
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
