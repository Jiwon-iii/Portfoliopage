"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Sparkles, Trash2 } from "lucide-react"
import { I18nTabs } from "@/components/admin/i18n-tabs"
import { TagInput } from "@/components/admin/tag-input"
import { ImageUpload, type UploadedImage } from "@/components/admin/image-upload"
import type { Work, WorkType } from "@/lib/schemas/work"

type FormState = {
  slug: string
  type: WorkType
  order: number
  title: { ko: string; ja?: string | null; en?: string | null }
  tagline: { ko?: string | null; ja?: string | null; en?: string | null }
  description: { ko?: string | null; ja?: string | null; en?: string | null }
  problem: { ko?: string | null; ja?: string | null; en?: string | null }
  approach: { ko?: string | null; ja?: string | null; en?: string | null }
  outcome: { ko?: string | null; ja?: string | null; en?: string | null }
  techs: string[]
  year?: number
  githubUrl: string
  liveUrl: string
  images: UploadedImage[]
  published: boolean
  featuredCandidate: boolean
}

function initialFromWork(w?: Work | null): FormState {
  return {
    slug: w?.slug ?? "",
    type: w?.type ?? "other",
    order: w?.order ?? 0,
    title: w?.title ?? { ko: "" },
    tagline: w?.tagline ?? { ko: "" },
    description: w?.description ?? { ko: "" },
    problem: w?.problem ?? { ko: "" },
    approach: w?.approach ?? { ko: "" },
    outcome: w?.outcome ?? { ko: "" },
    techs: w?.techs ?? [],
    year: w?.year,
    githubUrl: w?.githubUrl ?? "",
    liveUrl: w?.liveUrl ?? "",
    images: w?.images ?? [],
    published: w?.published ?? true,
    featuredCandidate: false,
  }
}

export function WorkForm({ work }: { work?: Work | null }) {
  const router = useRouter()
  const [state, setState] = useState<FormState>(initialFromWork(work))
  const [saving, setSaving] = useState(false)
  const isEdit = !!work
  const isFeatured = state.type === "featured"

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setState((s) => ({ ...s, [key]: value }))

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!state.slug.trim()) {
      toast.error("slug 는 필수입니다 (소문자·숫자·하이픈)")
      return
    }
    if (!state.title.ko.trim()) {
      toast.error("제목 (한국어) 는 필수입니다")
      return
    }
    setSaving(true)
    try {
      const payload = {
        slug: state.slug,
        type: state.type,
        order: state.order,
        title: state.title,
        tagline: state.tagline,
        description: state.description,
        problem: isFeatured ? state.problem : undefined,
        approach: isFeatured ? state.approach : undefined,
        outcome: isFeatured ? state.outcome : undefined,
        techs: state.techs,
        year: state.year || undefined,
        githubUrl: state.githubUrl || "",
        liveUrl: state.liveUrl || "",
        images: state.images,
        published: state.published,
      }
      const url = isEdit ? `/api/works/${work!._id}` : "/api/works"
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        toast.error(err.error || "저장 실패")
        return
      }
      toast.success(isEdit ? "수정 완료" : "추가 완료")
      router.push("/admin/works")
      router.refresh()
    } catch {
      toast.error("네트워크 오류")
    } finally {
      setSaving(false)
    }
  }

  async function onDelete() {
    if (!isEdit) return
    if (!confirm(`정말 "${state.title.ko}" 삭제할까요?`)) return
    const res = await fetch(`/api/works/${work!._id}`, { method: "DELETE" })
    if (res.ok) {
      toast.success("삭제 완료")
      router.push("/admin/works")
      router.refresh()
    } else {
      toast.error("삭제 실패")
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-4xl">
      {/* 메타 */}
      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="slug">slug <span className="text-primary text-xs font-mono ml-1">필수</span></Label>
            <Input
              id="slug"
              value={state.slug}
              onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
              placeholder="aisports"
              disabled={isEdit}
            />
            <p className="text-xs text-muted-foreground">URL 식별자 (수정 불가)</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">분류</Label>
            <select
              id="type"
              value={state.type}
              onChange={(e) => set("type", e.target.value as WorkType)}
              className="w-full h-9 px-3 border border-input rounded-md bg-background text-sm"
            >
              <option value="featured">Featured (영웅 — 메인 프로젝트)</option>
              <option value="other">Other (메인 프로젝트, 상세)</option>
              <option value="practice">Practice (연습·간략 리스트)</option>
              <option value="building">Currently Building (진행 중)</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">연도</Label>
            <Input
              id="year"
              type="number"
              min={2000}
              max={2100}
              value={state.year ?? ""}
              onChange={(e) => set("year", e.target.value ? Number(e.target.value) : undefined)}
              placeholder="2024"
            />
          </div>
        </div>
      </Card>

      {/* 텍스트 콘텐츠 */}
      <Card className="p-6 space-y-5">
        <I18nTabs
          label="제목"
          required
          value={state.title}
          onChange={(v) => set("title", v as FormState["title"])}
        />
        <I18nTabs
          label="한 줄 설명"
          hint="최대 60자"
          value={state.tagline}
          onChange={(v) => set("tagline", v)}
        />
        <I18nTabs
          label="상세 설명"
          hint="마크다운"
          multiline
          value={state.description}
          onChange={(v) => set("description", v)}
        />
      </Card>

      {/* Featured 전용: PROBLEM / APPROACH / OUTCOME */}
      {isFeatured && (
        <Card className="p-6 space-y-5 border-primary/40">
          <div className="text-xs text-primary font-mono tracking-wider font-semibold flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            FEATURED 전용 — 케이스 스터디
          </div>
          <I18nTabs label="문제 (PROBLEM)" value={state.problem} onChange={(v) => set("problem", v)} />
          <I18nTabs label="접근 (APPROACH)" value={state.approach} onChange={(v) => set("approach", v)} />
          <I18nTabs label="결과 (OUTCOME)" value={state.outcome} onChange={(v) => set("outcome", v)} />
        </Card>
      )}

      {/* 기술 태그 + URL */}
      <Card className="p-6 space-y-5">
        <div className="space-y-2">
          <Label>기술 태그</Label>
          <TagInput value={state.techs} onChange={(v) => set("techs", v)} />
          <p className="text-xs text-muted-foreground">Enter 또는 쉼표로 추가</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input
              id="githubUrl"
              type="url"
              value={state.githubUrl}
              onChange={(e) => set("githubUrl", e.target.value)}
              placeholder="https://github.com/..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="liveUrl">라이브 URL <span className="text-muted-foreground text-xs">선택</span></Label>
            <Input
              id="liveUrl"
              type="url"
              value={state.liveUrl}
              onChange={(e) => set("liveUrl", e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>
      </Card>

      {/* 이미지 */}
      <Card className="p-6 space-y-3">
        <Label>스크린샷 · 데모 이미지 <span className="text-muted-foreground text-xs">최대 5장. 첫 번째 = 썸네일</span></Label>
        <ImageUpload value={state.images} onChange={(v) => set("images", v)} />
      </Card>

      {/* 노출 설정 */}
      <Card className="p-6">
        <Label className="mb-3 block">노출 설정</Label>
        <div className="bg-background rounded-md px-4">
          <div className="flex justify-between items-center py-3 border-b border-border">
            <div>
              <div className="font-semibold text-sm">사이트에 공개</div>
              <div className="text-xs text-muted-foreground">OFF 면 어드민에만 보이고 사이트엔 노출 안 됨</div>
            </div>
            <Switch checked={state.published} onCheckedChange={(c) => set("published", c)} />
          </div>
          <div className="flex justify-between items-center py-3">
            <div>
              <div className="font-semibold text-sm">정렬 순서</div>
              <div className="text-xs text-muted-foreground">작을수록 위. 0~10 권장</div>
            </div>
            <Input
              type="number"
              min={0}
              value={state.order}
              onChange={(e) => set("order", Number(e.target.value) || 0)}
              className="w-24"
            />
          </div>
        </div>
      </Card>

      {/* 푸터: 저장/삭제 */}
      <div className="flex justify-between items-center sticky bottom-0 bg-background py-4 border-t border-border">
        <div className="text-xs text-muted-foreground font-mono">
          {isEdit ? `편집 중: ${work!.slug}` : "새 작품 생성"}
        </div>
        <div className="flex gap-2">
          {isEdit && (
            <Button type="button" variant="ghost" onClick={onDelete} className="text-destructive">
              <Trash2 className="h-4 w-4" />
              삭제
            </Button>
          )}
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
