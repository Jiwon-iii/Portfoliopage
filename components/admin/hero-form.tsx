"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { I18nTabs } from "@/components/admin/i18n-tabs"
import { ImageUpload, type UploadedImage } from "@/components/admin/image-upload"
import type { Hero } from "@/lib/schemas/hero"

export function HeroForm({ initial }: { initial: Hero | null }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState(initial?.name ?? { ko: "신지원", ja: "シン・ジウォン", en: "Shin Jiwon" })
  const [tagline, setTagline] = useState(initial?.tagline ?? { ko: "Next.js로 풀스택 웹을 만들면서 거기에 *AI*를 박아넣는 개발자." })
  const [metaLeft, setMetaLeft] = useState(initial?.metaLeft ?? { ko: "포트폴리오 · 2026 · 개발자" })
  const [location, setLocation] = useState(initial?.location ?? { ko: "서울" })
  const [focus, setFocus] = useState(initial?.focus ?? { ko: "AI × 풀스택" })
  const [status, setStatus] = useState(initial?.status ?? { ko: "구직 중" })
  const [github, setGithub] = useState(initial?.github ?? "https://github.com/Jiwon-iii")
  const [email, setEmail] = useState(initial?.email ?? "syrima03@gmail.com")
  const [emailSecondary, setEmailSecondary] = useState(initial?.emailSecondary ?? "")
  const [portrait, setPortrait] = useState<UploadedImage[]>(
    initial?.portrait ? [{ url: initial.portrait.url, alt: initial.portrait.alt }] : [],
  )

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/hero", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, tagline, metaLeft, location, focus, status,
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
      toast.success("Hero 저장 완료")
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-4xl">
      <Card className="p-6 space-y-5">
        <I18nTabs label="이름" required value={name} onChange={(v) => setName(v as typeof name)} />
        <I18nTabs label="한 줄 소개 (태그라인)" required hint="* * 로 감싸면 이탤릭+인디고 강조" multiline value={tagline} onChange={(v) => setTagline(v as typeof tagline)} />
        <I18nTabs label="상단 메타 (포트폴리오 · 2026 · 개발자)" value={metaLeft} onChange={setMetaLeft} />
      </Card>

      <Card className="p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <I18nTabs label="거점" value={location} onChange={setLocation} />
          <I18nTabs label="분야" value={focus} onChange={setFocus} />
          <I18nTabs label="상태" value={status} onChange={setStatus} />
        </div>
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
        <Label>증명사진 (Hero 우측에 표시)</Label>
        <ImageUpload value={portrait} onChange={(v) => setPortrait(v.slice(0, 1))} max={1} />
      </Card>

      <div className="flex justify-end gap-2 sticky bottom-0 bg-background py-4 border-t border-border">
        <Button type="submit" disabled={saving}>
          {saving ? "저장 중..." : "Hero 저장"}
        </Button>
      </div>
    </form>
  )
}
