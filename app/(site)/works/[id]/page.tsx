import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowUpRight, Lock } from "lucide-react"
import { PageHead } from "@/components/site/page-head"
import { Shot } from "@/components/site/shot"
import { RichText } from "@/components/site/rich-text"
import { OverviewTable, CtaBand } from "@/components/site/blocks"
import { getSiteLang } from "@/lib/site-lang"
import { label, pickLang } from "@/lib/i18n"
import { getWorkById } from "@/lib/repo/works"

export const dynamic = "force-dynamic"

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ id }, { lang }] = await Promise.all([params, getSiteLang()])
  const work = await getWorkById(id).catch(() => null)
  return { title: work ? pickLang(work.title, lang) : label("navWorks", lang) }
}

export default async function WorkPage({ params }: Props) {
  const [{ id }, { lang }] = await Promise.all([params, getSiteLang()])
  const work = await getWorkById(id).catch(() => null)
  if (!work || !work.published) notFound()

  const L = (k: Parameters<typeof label>[0]) => label(k, lang)
  const title = pickLang(work.title, lang)
  const sections = work.sections
    .map((s) => ({ title: pickLang(s.title, lang), body: pickLang(s.body, lang) }))
    .filter((s) => s.title || s.body)
  const meta: [string, string][] = [
    [L("status"), work.status === "in-progress" ? L("inProgress") : L("completed")],
    [L("year"), work.year ? String(work.year) : ""],
    [L("techs"), work.techs.join(", ")],
  ]

  return (
    <>
      <PageHead
        crumbs={[{ href: "/", label: L("home") }, { href: "/works", label: L("navWorks") }, { label: title }]}
        en={work.status === "in-progress" ? "IN PROGRESS" : "CASE STUDY"}
        title={title}
        lead={pickLang(work.tagline, lang)}
        image={work.images[0]}
      />
      <section className="sec" style={{ paddingTop: 72 }}>
        <div className="wrap">
          <OverviewTable rows={meta.filter(([, v]) => v)} />
          {(work.liveUrl || work.liveLabel) && (
            <p style={{ marginTop: 24 }}>
              {work.liveUrl ? (
                <a className="btn btn-p" href={work.liveUrl} target="_blank" rel="noreferrer">
                  {work.liveLabel || L("viewMore")} <ArrowUpRight size={16} />
                </a>
              ) : (
                // URL 없이 이름만 — 기업 의뢰 등 비공개
                <span className="chip"><Lock size={12} style={{ display: "inline", verticalAlign: -1 }} /> {work.liveLabel}</span>
              )}
            </p>
          )}

          {work.images.length > 1 && (
            <div className="gal">
              {work.images.slice(1, 7).map((img) => (
                <Shot key={img.url} image={img} alt={title} className="contain" sizes="(max-width: 860px) 100vw, 50vw" />
              ))}
            </div>
          )}

          {sections.map((s, i) => (
            <div key={i} className="dsec">
              <h2>{s.title}</h2>
              {s.body && <RichText text={s.body} />}
            </div>
          ))}

          <p style={{ marginTop: 32 }}><Link className="more" href="/works">{L("backToWorks")}</Link></p>
        </div>
      </section>
      <CtaBand lang={lang} />
    </>
  )
}
