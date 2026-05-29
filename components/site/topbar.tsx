"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { cn } from "@/lib/utils"
import { label, type Lang } from "@/lib/i18n"
import { LANG_COOKIE } from "@/lib/lang-cookie"

const LANG_BTN: Record<Lang, string> = { ko: "KR", ja: "JP", en: "EN" }

/** 1년 유지. 서버가 쿠키를 읽어 언어를 결정하므로 새로고침으로 반영. */
function persistLang(target: Lang) {
  document.cookie = `${LANG_COOKIE}=${target}; path=/; max-age=31536000; samesite=lax`
}

export function SiteTopbar({ lang = "ko", enabled = ["ko"] }: { lang?: Lang; enabled?: Lang[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function onLangClick(target: Lang) {
    if (target === lang) return
    persistLang(target)
    startTransition(() => router.refresh())
  }

  return (
    <header className="sticky top-0 z-20 h-14 border-b border-border bg-background/85 backdrop-blur">
      <div className="max-w-[1180px] mx-auto h-full px-10 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-3">
          <span className="font-serif font-extrabold text-base tracking-tight">신지원</span>
          <span className="text-xs font-mono text-muted-foreground tracking-wider">/</span>
          <span className="text-xs font-mono text-muted-foreground tracking-wider">SHIN JIWON</span>
        </Link>

        <nav className="hidden md:flex gap-7 text-sm">
          <a href="#work" className="text-muted-foreground hover:text-primary flex items-baseline gap-1.5">
            <span className="text-[10px] font-mono">01</span>{label("menuWork", lang)}
          </a>
          <a href="#about" className="text-muted-foreground hover:text-primary flex items-baseline gap-1.5">
            <span className="text-[10px] font-mono">04</span>{label("menuAbout", lang)}
          </a>
          <a href="#contact" className="text-muted-foreground hover:text-primary flex items-baseline gap-1.5">
            <span className="text-[10px] font-mono">08</span>{label("menuContact", lang)}
          </a>
        </nav>

        <div
          className={cn(
            "flex items-center gap-0.5 border border-border rounded-md bg-card p-0.5",
            pending && "opacity-60 pointer-events-none",
          )}
        >
          {enabled.map((l) => (
            <button
              key={l}
              onClick={() => onLangClick(l)}
              className={cn(
                "font-mono text-[11px] tracking-wider px-2.5 py-1 rounded transition-colors",
                lang === l
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {LANG_BTN[l]}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
