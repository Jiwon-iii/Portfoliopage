"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { I18nTabs } from "@/components/admin/i18n-tabs"
import { AdminLangBar } from "@/components/admin/admin-lang"
import { ImageUpload, type UploadedImage } from "@/components/admin/image-upload"
import type { Hero, HeroStat } from "@/lib/schemas/hero"

const MAX_STATS = 4

export function HeroForm({ initial }: { initial: Hero | null }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState(initial?.name ?? { ko: "신지원", ja: "シン・ジウォン", en: "Shin Jiwon" })
  const [tagline, setTagline] = useState(initial?.tagline ?? { ko: "Next.js로 풀스택 웹을 만들고, 거기에 *AI*를 자연스럽게 녹여내는 개발자." })
  const [lead, setLead] = useState(initial?.lead ?? { ko: "" })
  const [stats, setStats] = useState<HeroStat[]>(initial?.stats ?? [])
  const [location, setLocation] = useState(initial?.location ?? { ko: "서울" })
  const [github, setGithub] = useState(initial?.github ?? "https://github.com/Jiwon-iii")
  const [email, setEmail] = useState(initial?.email ?? "syrima03@gmail.com")
  const [emailSecondary, setEmailSecondary] = useState(initial?.emailSecondary ?? "")
  const [portrait, setPortrait] = useState<UploadedImage[]>(
    initial?.portrait ? [{ url: initial.portrait.url, alt: initial.portrait.alt }] : [],
  )

  // 숫자 띠 한 줄 조작
  const addStat = () => setStats((s) => [...s, { value: "", unit: { ko: "" }, label: { ko: "" } }])
  const removeStat = (i: number) => setStats((s) => s.filter((_, idx) => idx !== i))
  const updateStat = <K extends keyof HeroStat>(i: number, key: K, value: HeroStat[K]) =>
    setStats((s) => s.map((row, idx) => (idx === i ? { ...row, [key]: value } : row)))

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/hero", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // 옛 디자인 칸(상단 메타 · 분야 · 상태 · 회전 배너)은 사이트에서 안 써서 화면에서 뺌. 보내지 않으면 DB 값은 그대로
          name, tagline, lead, location,
          // 숫자를 비운 줄은 저장하지 않음
          stats: stats
            .map((s) => ({ ...s, value: s.value.trim() }))
            .filter((s) => s.value),
          github: github || "",
          email: email || "",
          emailSecondary: emailSecondary || "",
          portrait: portrait[0] ? { url: portrait[0].url, alt: portrait[0].alt } : null,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        toast.error(err.error || "저장 실패")
        return
      }
      toast.success("대표 소개 저장 완료")
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-4xl">
      <AdminLangBar />
      <Card className="p-6 space-y-5">
        <I18nTabs label="이름" required value={name} onChange={(v) => setName(v as typeof name)} />
        <I18nTabs label="한 줄 소개 (태그라인)" required hint="첫 화면 큰 문구. *단어* 로 감싸면 형광펜 강조" multiline value={tagline} onChange={(v) => setTagline(v as typeof tagline)} />
        <I18nTabs label="첫 화면 설명" hint="큰 문구 아래 한두 문장" multiline value={lead} onChange={setLead} />
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Label>숫자 띠</Label>
            <p className="text-xs text-muted-foreground mt-1">
              메인 첫 화면 아래 숫자 칸 (최대 {MAX_STATS}개). 숫자를 비운 줄은 저장되지 않습니다.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addStat} disabled={stats.length >= MAX_STATS}>
            <Plus className="h-3.5 w-3.5" />
            줄 추가
          </Button>
        </div>
        {stats.map((row, i) => (
          <div key={i} className="rounded-md border border-border p-4 space-y-4 bg-background">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground tracking-wider">칸 {i + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => removeStat(i)}
                aria-label="줄 삭제"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`stat-value-${i}`}>숫자</Label>
                <Input
                  id={`stat-value-${i}`}
                  value={row.value}
                  maxLength={12}
                  placeholder="2"
                  onChange={(e) => updateStat(i, "value", e.target.value)}
                />
              </div>
              <I18nTabs label="단위" hint="예: 件 / 社" value={row.unit} onChange={(v) => updateStat(i, "unit", v)} />
              <I18nTabs label="설명" hint="예: 特許出願" value={row.label} onChange={(v) => updateStat(i, "label", v)} />
            </div>
          </div>
        ))}
      </Card>

      <Card className="p-6 space-y-5">
        <I18nTabs label="거점" hint="概要 표 「所在地」" value={location} onChange={setLocation} />
      </Card>

      <Card className="p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>GitHub URL</Label>
            <Input type="url" value={github} onChange={(e) => setGithub(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>이메일 (메인)</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>이메일 (보조) <span className="text-muted-foreground text-xs">선택</span></Label>
            <Input type="email" value={emailSecondary} onChange={(e) => setEmailSecondary(e.target.value)} />
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-3">
        <Label>증명사진 (私について · お問い合わせ 페이지 맨 위)</Label>
        <ImageUpload value={portrait} onChange={(v) => setPortrait(v.slice(0, 1))} max={1} />
      </Card>

      <div className="flex justify-end gap-2 sticky bottom-0 bg-background py-4 border-t border-border">
        <Button type="submit" disabled={saving}>
          {saving ? "저장 중..." : "대표 소개 저장"}
        </Button>
      </div>
    </form>
  )
}
