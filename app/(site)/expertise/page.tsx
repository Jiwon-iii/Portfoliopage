import type { Metadata } from "next"
import Link from "next/link"
import { PageHead } from "@/components/site/page-head"
import { Shot } from "@/components/site/shot"
import { AreaChips } from "@/components/site/area-chips"
import { AreaArt } from "@/components/site/banner-art"
import { CtaBand } from "@/components/site/blocks"
import { getSiteLang } from "@/lib/site-lang"
import { label, pickLang } from "@/lib/i18n"
import { loadSite, expertiseImage, areaWorks } from "@/lib/site-content"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const { lang } = await getSiteLang()
  return { title: label("navExpertise", lang) }
}

/** 分野 › 全体: 분야마다 설명과 그 분야의 프로젝트 */
export default async function ExpertisePage() {
  const [data, { lang }] = await Promise.all([loadSite(), getSiteLang()])
  const L = (k: Parameters<typeof label>[0]) => label(k, lang)
  const items = data.expertise.map((x, i) => ({ x, img: expertiseImage(x, data.works, i) }))
  return (
    <>
      <PageHead
        crumbs={[{ href: "/", label: L("home") }, { label: L("navExpertise") }]}
        en="AREAS"
        title={L("navExpertise")}
        lead={L("expertiseLead")}
        art={<AreaArt labels={data.expertise.map((x) => x.navLabel || pickLang(x.title, lang))} />}
      />
      <section className="sec" style={{ paddingTop: 56 }}>
        <div className="wrap">
          <AreaChips areas={data.expertise} lang={lang} />
          {items.map(({ x, img }, i) => {
            const title = pickLang(x.title, lang)
            const related = areaWorks(x, data.works)
            return (
              <div key={x._id} className="srow">
                {img ? <Shot image={img} alt={title} sizes="(max-width: 860px) 100vw, 50vw" /> : <div className="typetile">{title}</div>}
                <div>
                  <span className="no">{x.navLabel || `AREA ${String(i + 1).padStart(2, "0")}`}</span>
                  <h2>{title}</h2>
                  {pickLang(x.description, lang) && <p>{pickLang(x.description, lang)}</p>}
                  {x.tags.length > 0 && <ul>{x.tags.map((t) => <li key={t}>{t}</li>)}</ul>}
                  <p style={{ marginBottom: 14 }}><Link className="more" href={`/expertise/${x._id}`}>{L("more")}</Link></p>
                  {related.length > 0 && (
                    <p className="rel">
                      {L("related")}
                      {related.map((w) => <Link key={w._id} href={`/works/${w._id}`}>{pickLang(w.title, lang)}</Link>)}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>
      <CtaBand lang={lang} />
    </>
  )
}
