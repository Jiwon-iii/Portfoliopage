import Link from "next/link"
import { Marked } from "./marked"
import { Shot } from "./shot"
import { label, pickLang, type Lang } from "@/lib/i18n"
import type { HistoryItem, SiteData } from "@/lib/site-content"

/** 大切にしていること 3칸 (메인·私について 공통). */
export function Values({ data, lang, flush }: { data: SiteData; lang: Lang; flush?: boolean }) {
  return (
    <div className={flush ? "values flush" : "values"}>
      {data.principles.map((p, i) => (
        <div key={p._id} className="val">
          <b>VALUE {String(i + 1).padStart(2, "0")}</b>
          <h3>{pickLang(p.title, lang)}</h3>
          {pickLang(p.body, lang) && <p>{pickLang(p.body, lang)}</p>}
        </div>
      ))}
    </div>
  )
}

/** ごあいさつ: 자기소개 본문 + 증명사진 + 서명. */
export function Message({ data, lang, photo = true }: { data: SiteData; lang: Lang; photo?: boolean }) {
  const portrait = photo ? data.hero?.portrait : null
  const paragraphs = (data.about?.paragraphs ?? []).map((p) => pickLang(p, lang)).filter(Boolean)
  return (
    <div className={portrait ? "msg" : "msg nophoto"}>
      {portrait && <Shot image={portrait} alt={pickLang(data.hero?.name, lang)} sizes="380px" />}
      <div>
        {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        <div className="sign">
          {label("role", lang)}
          <b>{pickLang(data.hero?.name, lang)}</b>
        </div>
      </div>
    </div>
  )
}

export function OverviewTable({ rows }: { rows: [string, string][] }) {
  return (
    <table className="ov">
      <tbody>
        {rows.map(([k, v]) => (
          <tr key={k}>
            <th scope="row">{k}</th>
            <td>{v.includes("@") && !v.includes(" ") ? <a href={`mailto:${v}`}>{v}</a> : v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function History({ items }: { items: HistoryItem[] }) {
  return (
    <ol className="hist">
      {items.map((h, i) => (
        <li key={i}>
          <span className="y">{h.date}</span>
          <span className="x">{h.title}{h.sub && <small>{h.sub}</small>}</span>
        </li>
      ))}
    </ol>
  )
}

/** 마무리 띠: 연락 페이지로. */
export function CtaBand({ lang }: { lang: Lang }) {
  return (
    <section className="cta">
      <div className="wrap">
        <div>
          <h2><Marked text={label("ctaTitle", lang)} /></h2>
          <p>{label("ctaSub", lang)}</p>
        </div>
        <Link className="btn btn-p" href="/contact">{label("ctaContact", lang)} →</Link>
      </div>
    </section>
  )
}
