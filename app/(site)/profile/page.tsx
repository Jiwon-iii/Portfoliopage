import type { Metadata } from "next"
import { PageHead } from "@/components/site/page-head"
import { HistoryArt } from "@/components/site/banner-art"
import { SectionHead } from "@/components/site/section-head"
import { OverviewTable, History, CtaBand } from "@/components/site/blocks"
import { getSiteLang } from "@/lib/site-lang"
import { label } from "@/lib/i18n"
import { loadSite, historyItems, overviewRows, certItems, skillGroups } from "@/lib/site-content"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const { lang } = await getSiteLang()
  return { title: label("navProfile", lang) }
}

export default async function ProfilePage() {
  const [data, { lang }] = await Promise.all([loadSite(), getSiteLang()])
  const L = (k: Parameters<typeof label>[0]) => label(k, lang)
  const skills = skillGroups(data.skills, lang)
  const history = historyItems(data, lang)
  // 배너 그림의 마디 = 연혁에 나오는 연도 + 지금
  const marks = [...new Set(history.map((h) => h.date.slice(0, 4)).filter((y) => /^\d{4}$/.test(y)))].concat("NOW")
  return (
    <>
      <PageHead crumbs={[{ href: "/", label: L("home") }, { label: L("navProfile") }]} en="PROFILE" title={L("navProfile")} art={<HistoryArt marks={marks} />} />
      <section className="sec">
        <div className="wrap">
          <SectionHead en="OVERVIEW" title={L("overview")} />
          <OverviewTable rows={overviewRows(data, lang)} />
        </div>
      </section>
      {/* 沿革 | 資格・免許 나란히 */}
      <section className="sec alt">
        <div className="wrap cols2">
          <div>
            <SectionHead en="HISTORY" title={L("history")} />
            <History items={history} />
          </div>
          <div>
            <SectionHead en="LICENSES" title={L("sectionCerts")} />
            <History items={certItems(lang)} />
          </div>
        </div>
      </section>
      {skills.length > 0 && (
      <section className="sec">
        <div className="wrap">
          <SectionHead en="SKILLS" title={L("sectionSkills")} />
          <dl className="skillrows">
            {skills.map((g) => (
              <div key={g.label}>
                <dt>{g.label}</dt>
                <dd>
                  <div className="tags skills">{g.items.map((s) => <span key={s}>{s}</span>)}</div>
                  {g.note && <small>{g.note}</small>}
                </dd>
              </div>
            ))}
          </dl>
          <p className="skills-sum">{L("skillsSum")}</p>
        </div>
      </section>
      )}
      <CtaBand lang={lang} />
    </>
  )
}
