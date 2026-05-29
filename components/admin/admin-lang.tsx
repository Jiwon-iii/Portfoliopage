"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import type { Lang } from "@/lib/i18n"

/**
 * 어드민 "콘텐츠 입력 언어" 전역 상태.
 * 각 i18n 필드마다 KR/JP/EN 탭을 따로 누르는 대신, 여기서 한 번 고르면
 * 모든 I18nTabs 가 같은 언어 입력으로 전환된다. (localStorage 에 유지)
 */
const LANG_LABELS: Record<Lang, string> = { ko: "KR", ja: "JP", en: "EN" }
const ORDER: Lang[] = ["ko", "ja", "en"]
const STORAGE_KEY = "admin-content-lang"

type Ctx = { lang: Lang; setLang: (l: Lang) => void }
const AdminLangContext = createContext<Ctx | null>(null)

export function AdminLangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ko")

  // 새로고침 후에도 마지막 선택 언어 복원
  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null
    if (saved === "ko" || saved === "ja" || saved === "en") setLangState(saved)
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    try {
      window.localStorage.setItem(STORAGE_KEY, l)
    } catch {
      /* localStorage 비가용 환경 무시 */
    }
  }

  return <AdminLangContext.Provider value={{ lang, setLang }}>{children}</AdminLangContext.Provider>
}

/** 컨텍스트가 없으면 null — I18nTabs 가 기존(필드별 탭) 동작으로 폴백. */
export function useAdminLang(): Ctx | null {
  return useContext(AdminLangContext)
}

/**
 * 폼 상단용 언어 바. 모바일 전용(lg:hidden) — 데스크톱은 사이드바 토글로 충분.
 * 각 어드민 폼 최상단에 배치하면 모바일에서도 입력 언어를 바꿀 수 있다.
 */
export function AdminLangBar({ className }: { className?: string }) {
  const ctx = useAdminLang()
  if (!ctx) return null
  return (
    <div
      className={cn(
        "lg:hidden flex items-center gap-3 rounded-md border border-border bg-card p-3",
        className,
      )}
    >
      <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">콘텐츠 입력 언어</span>
      <AdminLangToggle className="flex-1" />
    </div>
  )
}

/** 전역 언어 토글 (KR / JP / EN). 사이드바 등 한 곳에 배치. */
export function AdminLangToggle({ className }: { className?: string }) {
  const ctx = useAdminLang()
  if (!ctx) return null
  return (
    <div className={cn("flex items-center gap-1 rounded-md border border-border bg-background p-1", className)}>
      {ORDER.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => ctx.setLang(l)}
          className={cn(
            "flex-1 px-2 py-1 text-xs font-mono tracking-wider rounded transition-colors",
            ctx.lang === l
              ? "bg-primary text-primary-foreground font-semibold"
              : "text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
        >
          {LANG_LABELS[l]}
        </button>
      ))}
    </div>
  )
}
