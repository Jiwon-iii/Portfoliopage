import type { Metadata } from "next"
import { PageHead } from "@/components/site/page-head"
import { WorkCard } from "@/components/site/work-card"
import { CtaBand } from "@/components/site/blocks"
import { getSiteLang } from "@/lib/site-lang"
import { label } from "@/lib/i18n"
import { loadSite } from "@/lib/site-content"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const { lang } = await getSiteLang()
  return { title: label("navWorks", lang) }
}

export default async function WorksPage() {
  const [data, { lang }] = await Promise.all([loadSite(), getSiteLang()])
  const L = (k: Parameters<typeof label>[0]) => label(k, lang)
  return (
    <>
      <PageHead
        crumbs={[{ href: "/", label: L("home") }, { label: L("navWorks") }]}
        en="PROJECTS"
        title={L("navWorks")}
        lead={L("worksLead")}
        image={{ url: "/images/works-hero.jpg", alt: L("navWorks") }}
      />
      <section className="sec">
        <div className="wrap">
          {data.works.length ? (
            <div className="grid3">{data.works.map((w) => <WorkCard key={w._id} work={w} lang={lang} />)}</div>
          ) : (
            <div className="empty">{L("emptyWorks")}</div>
          )}
        </div>
      </section>
      <CtaBand lang={lang} />
    </>
  )
}
