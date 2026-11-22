import Link from "next/link"
import { label, pickLang, type Lang } from "@/lib/i18n"
import { NAV } from "./nav"
import type { SiteData } from "@/lib/site-content"

export function SiteFooter({ data, lang }: { data: SiteData; lang: Lang }) {
  const h = data.hero
  const col = (title: string, links: { href: string; text: string }[]) => (
    <div>
      <h4>{title}</h4>
      {links.map((l, i) => <Link key={i} href={l.href}>{l.text}</Link>)}
    </div>
  )
  return (
    <footer className="gf">
      <div className="wrap">
        <div className="cols">
          <div>
            <span className="bn">{h?.name?.en || pickLang(h?.name, lang) || "Shin Jiwon"}<small>FULL-STACK ENGINEER</small></span>
            <p>{[label("role", lang), pickLang(h?.location, lang)].filter(Boolean).join(" · ")}</p>
          </div>
          {col(label("navWorks", lang), data.works.slice(0, 3).map((w) => ({ href: `/works/${w._id}`, text: pickLang(w.title, lang) })))}
          {col(label("navAbout", lang), [
            { href: "/about", text: label("mission", lang) },
            { href: "/about", text: label("values", lang) },
            { href: "/about", text: label("message", lang) },
          ])}
          {col(label("navExpertise", lang), data.expertise.map((x) => ({ href: `/expertise/${x._id}`, text: x.navLabel || pickLang(x.title, lang) })))}
          {col(label("navProfile", lang), [
            { href: "/profile", text: label("overview", lang) },
            { href: "/profile", text: label("history", lang) },
            { href: "/contact", text: label("navContact", lang) },
          ])}
        </div>
        {/* 휴대폰: 세부 링크 대신 큰 메뉴만 */}
        <nav className="fnav">
          {NAV.map((n) => <Link key={n.href} href={n.href}>{label(n.key, lang)}</Link>)}
          <Link href="/contact">{label("navContact", lang)}</Link>
        </nav>
        {(h?.email || h?.github) && (
          <p className="fmail">{[h?.email, h?.github?.replace(/^https?:\/\//, "")].filter(Boolean).join(" ・ ")}</p>
        )}
        <div className="cp">
          <span>© {new Date().getFullYear()} {h?.name?.en || "Shin Jiwon"}</span>
          <span>{label("footerNote", lang)}</span>
        </div>
      </div>
    </footer>
  )
}
