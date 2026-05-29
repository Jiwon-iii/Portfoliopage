"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Sparkles, Trash2, Plus, ChevronUp, ChevronDown } from "lucide-react"
import { I18nTabs } from "@/components/admin/i18n-tabs"
import { AdminLangBar } from "@/components/admin/admin-lang"
import { TagInput } from "@/components/admin/tag-input"
import { ImageUpload, type UploadedImage } from "@/components/admin/image-upload"
import type { Work, WorkType, WorkStatus, WorkSection } from "@/lib/schemas/work"

type I18nValue = { ko?: string | null; ja?: string | null; en?: string | null }

type FormState = {
  slug: string
  type: WorkType
  status: WorkStatus
  order: number
  title: { ko: string; ja?: string | null; en?: string | null }
  tagline: { ko?: string | null; ja?: string | null; en?: string | null }
  sections: WorkSection[]
  techs: string[]
  year?: number
  liveUrl: string
  liveLabel: string
  images: UploadedImage[]
  published: boolean
}

function initialFromWork(w?: Work | null): FormState {
  return {
    slug: w?.slug ?? "",
    type: w?.type ?? "general",
    status: w?.status ?? "completed",
    order: w?.order ?? 0,
    title: w?.title ?? { ko: "" },
    tagline: w?.tagline ?? { ko: "" },
    sections: w?.sections ?? [],
    techs: w?.techs ?? [],
    year: w?.year,
    liveUrl: w?.liveUrl ?? "",
    liveLabel: w?.liveLabel ?? "",
    images: w?.images ?? [],
    published: w?.published ?? true,
  }
}

export function WorkForm({ work }: { work?: Work | null }) {
  const router = useRouter()
  const [state, setState] = useState<FormState>(initialFromWork(work))
  const [saving, setSaving] = useState(false)
  const isEdit = !!work

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setState((s) => ({ ...s, [key]: value }))

  // 상세 내용 단락 조작
  const addSection = () =>
    set("sections", [...state.sections, { title: { ko: "" }, body: { ko: "" } }])
  const removeSection = (i: number) =>
    set("sections", state.sections.filter((_, idx) => idx !== i))
  const updateSection = (i: number, key: "title" | "body", value: I18nValue) =>
    set("sections", state.sections.map((sec, idx) => (idx === i ? { ...sec, [key]: value } : sec)))
  const moveSection = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= state.sections.length) return
    const next = [...state.sections]
    ;[next[i], next[j]] = [next[j], next[i]]
    set("sections", next)
  }

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
        status: state.status,
        order: state.order,
        title: state.title,
        tagline: state.tagline,
        sections: state.sections,
        techs: state.techs,
        year: state.year || undefined,
        liveUrl: state.liveUrl || "",
        liveLabel: (state.liveLabel ?? "").trim() || undefined,
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
      <AdminLangBar />
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
              <option value="general">일반 (대표 / 상세 프로젝트)</option>
              <option value="practice">연습 (간략 리스트)</option>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">상태</Label>
            <select
              id="status"
              value={state.status}
              onChange={(e) => set("status", e.target.value as WorkStatus)}
              className="w-full h-9 px-3 border border-input rounded-md bg-background text-sm"
            >
              <option value="completed">완료</option>
              <option value="in-progress">진행 중</option>
            </select>
            <p className="text-xs text-muted-foreground">진행 중이면 사이트에 진행 중 배지가 표시됩니다.</p>
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
      </Card>

      {/* 상세 내용 단락 (제목+내용, 자유 추가/삭제) */}
      <Card className="p-6 space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              상세 내용 <span className="text-xs text-muted-foreground font-normal">단락별 제목 + 내용</span>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addSection}>
              <Plus className="h-3.5 w-3.5" />
              단락 추가
            </Button>
          </div>

          {state.sections.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              단락을 추가해 제목·내용으로 상세 내용을 구성하세요. (예: 개요 / 문제 / 접근 / 결과)
              제목을 비워두면 내용만 표시됩니다.
            </p>
          ) : (
            <div className="space-y-4">
              {state.sections.map((sec, i) => (
                <div key={i} className="rounded-md border border-border p-4 space-y-4 bg-background">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground tracking-wider">
                      단락 {i + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        disabled={i === 0}
                        onClick={() => moveSection(i, -1)}
                        aria-label="위로"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        disabled={i === state.sections.length - 1}
                        onClick={() => moveSection(i, 1)}
                        aria-label="아래로"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => removeSection(i)}
                        aria-label="단락 삭제"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <I18nTabs
                    label="단락 제목"
                    value={sec.title}
                    onChange={(v) => updateSection(i, "title", v)}
                  />
                  <I18nTabs
                    label="단락 내용"
                    hint="마크다운"
                    multiline
                    value={sec.body}
                    onChange={(v) => updateSection(i, "body", v)}
                  />
                </div>
              ))}
            </div>
          )}
      </Card>

      {/* 기술 태그 + URL */}
      <Card className="p-6 space-y-5">
        <div className="space-y-2">
          <Label>기술 태그</Label>
          <TagInput value={state.techs} onChange={(v) => set("techs", v)} />
          <p className="text-xs text-muted-foreground">Enter 또는 쉼표로 추가</p>
        </div>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="liveLabel">버튼 이름 <span className="text-muted-foreground text-xs">선택</span></Label>
              <Input
                id="liveLabel"
                value={state.liveLabel}
                onChange={(e) => set("liveLabel", e.target.value)}
                placeholder="자세히 보기"
                maxLength={40}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="liveUrl">링크 URL <span className="text-muted-foreground text-xs">선택</span></Label>
              <Input
                id="liveUrl"
                type="url"
                value={state.liveUrl}
                onChange={(e) => set("liveUrl", e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            버튼 이름을 비우면 &ldquo;자세히 보기&rdquo;로 표시됩니다.
            URL 을 넣으면 클릭 가능한 버튼, 버튼 이름만 넣고 URL 을 비우면 클릭 안 되는 텍스트로 표시됩니다
            (예: 기업 의뢰 · 비공개). 둘 다 비우면 아무것도 표시되지 않습니다.
          </p>
        </div>
      </Card>

      {/* 이미지 */}
      <Card className="p-6 space-y-3">
        <Label>스크린샷 · 데모 이미지 <span className="text-muted-foreground text-xs">최대 10장. 첫 번째 = 썸네일</span></Label>
        <ImageUpload value={state.images} onChange={(v) => set("images", v)} max={10} />
      </Card>

      {/* 노출 설정 */}
      <Card className="p-6">
        <Label className="mb-3 block">노출 설정</Label>
        <div className="bg-background rounded-md px-4">
          <div className="flex justify-between items-center py-3">
            <div>
              <div className="font-semibold text-sm">사이트에 공개</div>
              <div className="text-xs text-muted-foreground">OFF 면 어드민에만 보이고 사이트엔 노출 안 됨</div>
            </div>
            <Switch checked={state.published} onCheckedChange={(c) => set("published", c)} />
          </div>
        </div>
      </Card>

      {/* 푸터: 저장/삭제 */}
      <div className="flex justify-between items-center sticky bottom-0 bg-background py-4 border-t border-border">
        <div className="text-xs text-muted-foreground font-mono">
          {isEdit ? `편집 중: ${work!.slug}` : "새 프로젝트 생성"}
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
