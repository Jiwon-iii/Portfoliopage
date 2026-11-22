import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PageHead } from "@/components/site/page-head"
import { AreaChips } from "@/components/site/area-chips"
import { WorkCard } from "@/components/site/work-card"
import { CtaBand } from "@/components/site/blocks"
import { getSiteLang } from "@/lib/site-lang"
import { label, pickLang } from "@/lib/i18n"
import { loadSite, areaWorks, expertiseImage } from "@/lib/site-content"

export const dynamic = "force-dynamic"

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ id }, { lang }, data] = await Promise.all([params, getSiteLang(), loadSite()])
  const area = data.expertise.find((x) => x._id === id)
  return { title: area ? pickLang(area.title, lang) : label("navExpertise", lang) }
}

/** 分野 › 하나 (Web · AI · Server …): 분야 설명 + 그 분야의 프로젝트 */
export default async function AreaPage({ params }: Props) {
  const [{ id }, { lang }, data] = await Promise.all([params, getSiteLang(), loadSite()])
  const index = data.expertise.findIndex((x) => x._id === id)
  if (index < 0) notFound()
  const area = data.expertise[index]
  const L = (k: Parameters<typeof label>[0]) => label(k, lang)
  const works = areaWorks(area, data.works)

  return (
    <>
      <PageHead
        crumbs={[{ href: "/", label: L("home") }, { href: "/expertise", label: L("navExpertise") }, { label: area.navLabel || pickLang(area.title, lang) }]}
        en={(area.navLabel || "AREAS").toUpperCase()}
        title={pickLang(area.title, lang)}
        lead={pickLang(area.description, lang)}
        image={expertiseImage(area, data.works, index)}
      />
      <section className="sec">
        <div className="wrap">
          <AreaChips areas={data.expertise} current={area._id} lang={lang} />
          {works.length ? (
            <div className="grid3">{works.map((w) => <WorkCard key={w._id} work={w} lang={lang} />)}</div>
          ) : (
            <div className="empty">{L("emptyWorks")}</div>
          )}
        </div>
      </section>
      <CtaBand lang={lang} />
    </>
  )
}
