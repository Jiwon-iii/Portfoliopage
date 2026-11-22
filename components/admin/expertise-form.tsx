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
import { ImageUpload, type UploadedImage } from "@/components/admin/image-upload"
import type { Expertise } from "@/lib/schemas/expertise"

type I18nValue = { ko?: string | null; ja?: string | null; en?: string | null }

/** 관련 실적 체크박스용 — 서버 페이지에서 works 를 {_id, 한국어 제목} 으로 줄여 넘김 */
export type WorkOption = { _id: string; title: string }

export function ExpertiseForm({ expertise, works }: { expertise?: Expertise | null; works: WorkOption[] }) {
  const router = useRouter()
  const isEdit = !!expertise
  const [saving, setSaving] = useState(false)
  const [order, setOrder] = useState(expertise?.order ?? 0)
  const [title, setTitle] = useState<I18nValue>(expertise?.title ?? { ko: "" })
  const [navLabel, setNavLabel] = useState(expertise?.navLabel ?? "")
  const [description, setDescription] = useState<I18nValue>(expertise?.description ?? { ko: "" })
  const [tags, setTags] = useState<string[]>(expertise?.tags ?? [])
  // 대표 이미지는 1장만 — ImageUpload 는 배열을 다루므로 길이 0~1 배열로 보관
  const [image, setImage] = useState<UploadedImage[]>(expertise?.image ? [expertise.image] : [])
  const [relatedWorkIds, setRelatedWorkIds] = useState<string[]>(expertise?.relatedWorkIds ?? [])
  const [published, setPublished] = useState(expertise?.published ?? true)

  function toggleWork(id: string, checked: boolean) {
    setRelatedWorkIds((ids) => (checked ? [...ids, id] : ids.filter((x) => x !== id)))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.ko?.trim()) {
      toast.error("제목(한국어) 필수")
      return
    }
    setSaving(true)
    try {
      const url = isEdit ? `/api/expertise/${expertise!._id}` : "/api/expertise"
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order, title, navLabel: navLabel.trim(), description, tags,
          image: image[0] ?? null,
          relatedWorkIds,
          published,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        toast.error(err.error || "저장 실패")
        return
      }
      toast.success(isEdit ? "수정 완료" : "추가 완료")
      router.push("/admin/expertise")
      router.refresh()
    } catch {
      toast.error("네트워크 오류")
    } finally {
      setSaving(false)
    }
  }

  async function onDelete() {
    if (!isEdit || !confirm("정말 삭제할까요?")) return
    const res = await fetch(`/api/expertise/${expertise!._id}`, { method: "DELETE" })
    if (res.ok) {
      toast.success("삭제 완료")
      router.push("/admin/expertise")
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
        <I18nTabs label="제목" required hint="예: Webサービス開発" value={title} onChange={setTitle} />
        <div className="space-y-2">
          <Label htmlFor="navLabel">메뉴 이름</Label>
          <Input id="navLabel" value={navLabel} maxLength={20} placeholder="예: Web · AI · Server" onChange={(e) => setNavLabel(e.target.value)} className="w-48" />
          <p className="text-xs text-muted-foreground">위쪽 「分野」 메뉴에 마우스를 올렸을 때 보이는 짧은 이름. 비우면 제목이 나옵니다.</p>
        </div>
        <I18nTabs label="설명" multiline value={description} onChange={setDescription} />
        <div className="space-y-2">
          <Label>태그</Label>
          <TagInput value={tags} onChange={setTags} />
          <p className="text-xs text-muted-foreground">Enter 또는 쉼표로 추가</p>
        </div>
      </Card>

      <Card className="p-6 space-y-3">
        <Label>대표 이미지 <span className="text-muted-foreground text-xs">1장</span></Label>
        <ImageUpload value={image} onChange={(v) => setImage(v.slice(0, 1))} max={1} />
      </Card>

      <Card className="p-6 space-y-3">
        <Label>관련 실적</Label>
        {works.length === 0 ? (
          <p className="text-xs text-muted-foreground">등록된 프로젝트가 없어요.</p>
        ) : (
          <div className="space-y-1">
            {works.map((w) => (
              <label key={w._id} className="flex items-center gap-3 py-1.5 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={relatedWorkIds.includes(w._id)}
                  onChange={(e) => toggleWork(w._id, e.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
                {w.title || "—"}
              </label>
            ))}
          </div>
        )}
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
