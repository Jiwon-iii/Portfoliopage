import type { Metadata } from "next"
import { PageHead } from "@/components/site/page-head"
import { getSiteLang } from "@/lib/site-lang"
import { label } from "@/lib/i18n"
import { loadSite } from "@/lib/site-content"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const { lang } = await getSiteLang()
  return { title: label("navContact", lang) }
}

export default async function ContactPage() {
  const [data, { lang }] = await Promise.all([loadSite(), getSiteLang()])
  const L = (k: Parameters<typeof label>[0]) => label(k, lang)
  const h = data.hero
  return (
    <>
      <PageHead
        crumbs={[{ href: "/", label: L("home") }, { label: L("navContact") }]}
        en="CONTACT"
        title={L("navContact")}
        lead={L("contactLead")}
        image={h?.portrait}
        portrait
      />
      <section className="sec">
        <div className="wrap">
          <div className="ccards">
            {h?.email && (
              <div className="cc">
                <span className="no">MAIL</span>
                <h2>{L("mailTitle")}</h2>
                <p>{L("mailBody")}</p>
                <a className="btn btn-p" href={`mailto:${h.email}`}>{h.email} →</a>
                {h.emailSecondary && (
                  <span className="sub">{L("mailSecondary")}: <a href={`mailto:${h.emailSecondary}`}>{h.emailSecondary}</a></span>
                )}
              </div>
            )}
            {h?.github && (
              <div className="cc">
                <span className="no">GITHUB</span>
                <h2>{L("githubTitle")}</h2>
                <p>{L("githubBody")}</p>
                <a className="btn btn-s" href={h.github} target="_blank" rel="noreferrer">{h.github.replace(/^https?:\/\//, "")}</a>
              </div>
            )}
          </div>
          {!h?.email && !h?.github && <div className="empty">{L("contactEmpty")}</div>}
        </div>
      </section>
    </>
  )
}
