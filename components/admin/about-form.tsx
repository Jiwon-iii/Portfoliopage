"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { I18nTabs } from "@/components/admin/i18n-tabs"
import type { About } from "@/lib/schemas/about"

type I18nValue = { ko?: string | null; ja?: string | null; en?: string | null }

export function AboutForm({ initial }: { initial: About | null }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [heading, setHeading] = useState<I18nValue>(initial?.heading ?? { ko: "" })
  const [paragraphs, setParagraphs] = useState<I18nValue[]>(initial?.paragraphs?.length ? initial.paragraphs : [{ ko: "" }])
  const [caption, setCaption] = useState<I18nValue>(initial?.caption ?? { ko: "" })

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/about", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heading, paragraphs, caption }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        toast.error(err.error || "저장 실패")
        return
      }
      toast.success("About 저장 완료")
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-4xl">
      <Card className="p-6 space-y-5">
        <I18nTabs
          label="큰 인용문 (heading)"
          required
          hint="* * 로 감싸면 이탤릭+인디고"
          value={heading}
          onChange={(v) => setHeading(v)}
        />
      </Card>

      <Card className="p-6 space-y-5">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">본문 단락</h3>
          <Button type="button" variant="outline" size="sm" onClick={() => setParagraphs([...paragraphs, { ko: "" }])}>
            <Plus className="h-4 w-4" />
            단락 추가
          </Button>
        </div>
        {paragraphs.map((p, i) => (
          <div key={i} className="relative">
            <I18nTabs
              label={`단락 ${i + 1}`}
              multiline
              value={p}
              onChange={(v) => setParagraphs(paragraphs.map((x, idx) => (idx === i ? v : x)))}
            />
            {paragraphs.length > 1 && (
              <button
                type="button"
                onClick={() => setParagraphs(paragraphs.filter((_, idx) => idx !== i))}
                className="absolute top-0 right-0 text-destructive opacity-60 hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </Card>

      <Card className="p-6 space-y-3">
        <I18nTabs label="포트레이트 캡션 (선택)" value={caption} onChange={(v) => setCaption(v)} />
      </Card>

      <div className="flex justify-end sticky bottom-0 bg-background py-4 border-t border-border">
        <Button type="submit" disabled={saving}>
          {saving ? "저장 중..." : "About 저장"}
        </Button>
      </div>
    </form>
  )
}
