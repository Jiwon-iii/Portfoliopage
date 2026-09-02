"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAdminLang } from "@/components/admin/admin-lang"
import type { Lang } from "@/lib/i18n"

const LANG_LABELS: Partial<Record<Lang, { name: string; flag: string }>> = {
  ko: { name: "한국어", flag: "KR" },
  ja: { name: "日本語", flag: "JP" },
}

type I18nValue = { ko?: string | null; ja?: string | null; en?: string | null }

export function I18nTabs({
  label,
  required,
  hint,
  multiline,
  value,
  onChange,
}: {
  label: string
  required?: boolean
  hint?: string
  multiline?: boolean
  value: I18nValue | undefined
  onChange: (next: I18nValue) => void
}) {
  // 전역 언어가 설정돼 있으면 그 언어를 따르고 필드별 탭은 숨긴다 (없으면 기존 동작).
  const adminLang = useAdminLang()
  const [internal, setInternal] = useState<Lang>("ko")
  const active = adminLang ? adminLang.lang : internal
  const globalMode = !!adminLang
  const v = value ?? { ko: "", ja: "", en: "" }

  const update = (lang: Lang) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange({ ...v, [lang]: e.target.value })
  }

  const Input_ = multiline ? Textarea : Input

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <label className="text-sm font-semibold flex items-center gap-2">
          {label}
          {required && <span className="text-primary text-xs font-mono ml-1.5">필수</span>}
          {globalMode && (
            <span className="text-[10px] font-mono tracking-wider text-muted-foreground border border-border rounded px-1.5 py-0.5">
              {LANG_LABELS[active]?.flag}
              {active !== "ko" && !v[active] && <span className="ml-1 opacity-60">비어있음</span>}
            </span>
          )}
        </label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>

      {!globalMode && (
        <div className="flex gap-0 border-b border-border">
          {(Object.keys(LANG_LABELS) as Lang[]).map((lang) => {
            const isEmpty = !v[lang]
            return (
              <button
                key={lang}
                type="button"
                onClick={() => setInternal(lang)}
                className={cn(
                  "px-3 py-2 text-xs font-mono tracking-wider border-b-2 transition-colors flex items-center gap-2",
                  active === lang
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {LANG_LABELS[lang]?.flag}
                {!isEmpty && <span className="w-1 h-1 rounded-full bg-emerald-500" />}
                {isEmpty && lang !== "ko" && <span className="text-[10px] opacity-50">비어있음</span>}
              </button>
            )
          })}
        </div>
      )}

      <Input_
        value={v[active] ?? ""}
        onChange={update(active)}
        placeholder={
          active === "ko"
            ? "한국어 콘텐츠 (V1 필수)"
            : active === "ja"
              ? "일본어 콘텐츠 (V1.5)"
              : "English content (V1.5)"
        }
        {...(multiline ? { rows: 5 } : {})}
      />
    </div>
  )
}
