import Link from "next/link"
import { label, pickLang, type Lang } from "@/lib/i18n"
import type { Expertise } from "@/lib/schemas/expertise"

/** 分野 고르기: 全体 / Web / AI / Server … (위쪽 드롭다운과 같은 목록) */
export function AreaChips({ areas, current, lang }: { areas: Expertise[]; current?: string; lang: Lang }) {
  return (
    <nav className="areas" aria-label={label("navExpertise", lang)}>
      <Link href="/expertise" aria-current={current ? undefined : "page"}>{label("all", lang)}</Link>
      {areas.map((a) => (
        <Link key={a._id} href={`/expertise/${a._id}`} aria-current={current === a._id ? "page" : undefined}>
          {a.navLabel || pickLang(a.title, lang)}
        </Link>
      ))}
    </nav>
  )
}
