"use client"

import { useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { Lang } from "@/lib/i18n"

export function SiteTopbar({ lang = "ko" }: { lang?: Lang }) {
  const [activeLang, setActiveLang] = useState<Lang>(lang)

  function onLangClick(target: Lang) {
    if (target !== "ko") {
      toast.info("JP / EN 버전은 V1.5에 공개됩니다. 지금은 KR 로 표시.")
      return
    }
    setActiveLang(target)
  }

  return (
    <header className="sticky top-0 z-20 h-14 border-b border-border bg-background/85 backdrop-blur">
      <div className="max-w-[1180px] mx-auto h-full px-10 flex items-center justify-between">
        <a href="/" className="flex items-baseline gap-3">
          <span className="font-serif font-extrabold text-base tracking-tight">신지원</span>
          <span className="text-xs font-mono text-muted-foreground tracking-wider">/</span>
          <span className="text-xs font-mono text-muted-foreground tracking-wider">SHIN JIWON</span>
        </a>

        <nav className="hidden md:flex gap-7 text-sm">
          <a href="#work" className="text-muted-foreground hover:text-primary flex items-baseline gap-1.5">
            <span className="text-[10px] font-mono">01</span>작업
          </a>
          <a href="#about" className="text-muted-foreground hover:text-primary flex items-baseline gap-1.5">
            <span className="text-[10px] font-mono">04</span>소개
          </a>
          <a href="#contact" className="text-muted-foreground hover:text-primary flex items-baseline gap-1.5">
            <span className="text-[10px] font-mono">08</span>연락
          </a>
        </nav>

        <div className="flex items-center gap-0.5 border border-border rounded-md bg-card p-0.5">
          {(["ko", "ja", "en"] as const).map((l) => (
            <button
              key={l}
              onClick={() => onLangClick(l)}
              className={cn(
                "font-mono text-[11px] tracking-wider px-2.5 py-1 rounded transition-colors",
                activeLang === l
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {l === "ko" ? "KR" : l === "ja" ? "JP" : "EN"}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
