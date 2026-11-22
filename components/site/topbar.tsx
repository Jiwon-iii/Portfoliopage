"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import { ChevronDown, Menu, X } from "lucide-react"
import { label, pickLang, type Lang } from "@/lib/i18n"
import { LANG_COOKIE } from "@/lib/lang-cookie"
import type { I18nField } from "@/lib/schemas/i18n-field"
import { NAV } from "./nav"

const LANG_BTN: Record<Lang, string> = { ko: "KR", ja: "JP", en: "EN" }

// 휴대폰 메뉴는 お問い合わせ 까지 5줄
const MNAV = [...NAV, { href: "/contact", key: "navContact", en: "CONTACT" }] as const

/** 1년 유지. 서버가 쿠키를 읽어 언어를 결정하므로 새로고침으로 반영. */
function persistLang(target: Lang) {
  document.cookie = `${LANG_COOKIE}=${target}; path=/; max-age=31536000; samesite=lax`
}

export function SiteTopbar({ lang, enabled, name, email, areas }: { lang: Lang; enabled: Lang[]; name?: I18nField | null; email?: string; areas: { id: string; label: string }[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const [pending, startTransition] = useTransition()
  const [open, setOpen] = useState(false) // 휴대폰 메뉴
  const [areasOpen, setAreasOpen] = useState(false) // 휴대폰 메뉴의 分野 ▾
  const close = () => setOpen(false)

  // 휴대폰 메뉴: Esc 로 닫기
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  function onLangClick(target: Lang) {
    if (target === lang) return
    persistLang(target)
    startTransition(() => router.refresh())
  }

  return (
    <header className="gh">
      <div className="wrap">
        <Link href="/" className="brand">
          <Image className="mark" src="/images/avatar.jpg" alt="" width={36} height={36} priority />
          <span className="bn">
            {name?.en || pickLang(name, lang) || "Shin Jiwon"}
            <small>FULL-STACK ENGINEER</small>
          </span>
        </Link>
        <nav className="gnav">
          {NAV.map((n) => {
            const link = (
              <Link key={n.href} href={n.href} aria-current={pathname.startsWith(n.href) ? "page" : undefined}>
                {label(n.key, lang)}
              </Link>
            )
            if (n.href !== "/expertise") return link
            // 分野: 마우스를 올리거나 Tab 으로 들어오면 분야 목록이 펼쳐짐
            return (
              <div key={n.href} className="dd">
                {link}
                <div className="dd-menu">
                  <div className="dd-panel">
                    <Link href="/expertise">{label("all", lang)}</Link>
                    {areas.map((a) => <Link key={a.id} href={`/expertise/${a.id}`}>{a.label}</Link>)}
                  </div>
                </div>
              </div>
            )
          })}
        </nav>
        <div className="gright">
          {enabled.length > 1 && (
            <div className="lang" style={pending ? { opacity: 0.5 } : undefined}>
              {enabled.map((l) => (
                <button key={l} type="button" aria-pressed={lang === l} onClick={() => onLangClick(l)}>
                  {LANG_BTN[l]}
                </button>
              ))}
            </div>
          )}
          <Link className="btn btn-p" href="/contact">{label("ctaContact", lang)}</Link>
          <button
            type="button"
            className="menu-btn"
            aria-label={label("menu", lang)}
            aria-expanded={open}
            aria-controls="mnav"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {/* 휴대폰 메뉴: 좁은 화면에서만 보임 (site.css). 큰 글자 5줄, 分野만 ▾ 로 하위 펼침 */}
      {open && (
        <nav id="mnav" className="mnav" aria-label={label("menu", lang)}>
          <div className="wrap">
            <ol className="mlist">
              {MNAV.map((n, i) => (
                <li key={n.href}>
                  <div className="mrow">
                    <Link href={n.href} aria-current={pathname.startsWith(n.href) ? "page" : undefined} onClick={close}>
                      <span className="mn">{String(i + 1).padStart(2, "0")}</span>
                      <span className="mj">{label(n.key, lang)}</span>
                      <span className="men">{n.en}</span>
                    </Link>
                    {n.href === "/expertise" && areas.length > 0 && (
                      <button
                        type="button"
                        className="mchev"
                        aria-expanded={areasOpen}
                        aria-controls="msub"
                        aria-label={label("navExpertise", lang)}
                        onClick={() => setAreasOpen((v) => !v)}
                      >
                        <ChevronDown size={20} />
                      </button>
                    )}
                  </div>
                  {n.href === "/expertise" && areasOpen && (
                    <div id="msub" className="msub">
                      <Link href="/expertise" onClick={close}>{label("all", lang)}</Link>
                      {areas.map((x) => <Link key={x.id} href={`/expertise/${x.id}`} onClick={close}>{x.label}</Link>)}
                    </div>
                  )}
                </li>
              ))}
            </ol>
            <div className="mfoot">
              {email ? <a href={`mailto:${email}`}>{email}</a> : <span />}
              <Link className="btn btn-p" href="/contact" onClick={close}>{label("ctaContact", lang)} →</Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
