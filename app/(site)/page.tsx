import Link from "next/link"
import { Marked } from "@/components/site/marked"
import { Shot } from "@/components/site/shot"
import { SectionHead } from "@/components/site/section-head"
import { WorkCard } from "@/components/site/work-card"
import { Values, Message, OverviewTable, History, CtaBand } from "@/components/site/blocks"
import { getSiteLang } from "@/lib/site-lang"
import { label, pickLang } from "@/lib/i18n"
import { loadSite, expertiseImage, historyItems, overviewRows } from "@/lib/site-content"

/** 쿠키(lang)로 표시 언어가 갈리므로 요청마다 동적 렌더링. 어드민 수정도 즉시 반영. */
export const dynamic = "force-dynamic"

export default async function HomePage() {
  const [data, { lang }] = await Promise.all([loadSite(), getSiteLang()])
  const h = data.hero
  const L = (k: Parameters<typeof label>[0]) => label(k, lang)
  const shots = data.works.filter((w) => w.images.length).slice(0, 3).map((w) => w.images[0])
  const ongoing = data.works.filter((w) => w.status === "in-progress")
  const stats = h?.stats?.length
    ? h.stats.map((s) => ({ value: s.value, unit: pickLang(s.unit, lang), label: pickLang(s.label, lang) }))
    : [
        { value: String(data.works.length), unit: L("unitCount"), label: L("statProjects") },
        { value: String(ongoing.length), unit: L("unitCount"), label: L("statInProgress") },
        { value: String(data.skills.length), unit: "", label: L("statSkills") },
      ]

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div data-enter>
            <p className="eyebrow">FULL-STACK ENGINEER</p>
            <h1><Marked text={pickLang(h?.tagline, lang)} /></h1>
            {pickLang(h?.lead, lang) && <p className="hero-lead">{pickLang(h?.lead, lang)}</p>}
            <div className="ctas">
              <Link className="btn btn-p" href="/works">{L("viewWorks")} →</Link>
              <Link className="btn btn-s" href="/about">{L("navAbout")}</Link>
            </div>
          </div>
          {shots.length > 0 && (
            <div className="hero-visual">
              {shots.map((img, i) => <Shot key={img.url} image={img} alt="" priority={i === 1} />)}
            </div>
          )}
        </div>
      </section>

      {ongoing.length > 0 && (
        <section className="news">
          <div className="wrap">
            <h2><small>NEWS</small>{L("newsTitle")}</h2>
            <div className="nl">
              {ongoing.map((w) => (
                <Link key={w._id} href={`/works/${w._id}`}>
                  <span className="d">{w.year ?? ""}</span>
                  <span className="t">{L("inProgress")}</span>
                  <span className="tt">{pickLang(w.title, lang)}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="sec">
        <div className="wrap">
          <SectionHead en="PROJECTS" title={L("navWorks")} more={{ href: "/works", label: L("more") }} />
          {data.works.length ? (
            <div className="grid3">{data.works.slice(0, 3).map((w) => <WorkCard key={w._id} work={w} lang={lang} />)}</div>
          ) : (
            <div className="empty">{L("emptyWorks")}</div>
          )}
        </div>
      </section>

      <section className="sec alt">
        <div className="wrap">
          <SectionHead en="ABOUT" title={L("navAbout")} more={{ href: "/about", label: L("more") }} />
          {data.about?.heading && <p className="stmt"><Marked text={pickLang(data.about.heading, lang)} /></p>}
          <Values data={data} lang={lang} />
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <SectionHead en="AREAS" title={L("navExpertise")} more={{ href: "/expertise", label: L("more") }} />
          <div className="grid3">
            {data.expertise.map((x, i) => {
              const img = expertiseImage(x, data.works, i)
              const title = pickLang(x.title, lang)
              return (
                <Link key={x._id} className="svc card" href={`/expertise/${x._id}`}>
                  {img ? <Shot image={img} alt={title} /> : <div className="typetile">{title}</div>}
                  <div className="cb">
                    <span className="no">{x.navLabel || `AREA ${String(i + 1).padStart(2, "0")}`}</span>
                    <h3>{title}</h3>
                    {pickLang(x.description, lang) && <p>{pickLang(x.description, lang)}</p>}
                    <div className="tags">{x.tags.map((t) => <span key={t}>{t}</span>)}</div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="nums">
        <div className="wrap" style={{ "--n": stats.length } as React.CSSProperties}>
          {stats.map((s, i) => (
            <div key={i} className="num">
              <b>{s.value}{s.unit && <small>{s.unit}</small>}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {data.about?.paragraphs?.length ? (
        <section className="sec alt">
          <div className="wrap">
            <SectionHead en="MESSAGE" title={L("message")} more={{ href: "/about", label: L("more") }} />
            <Message data={data} lang={lang} />
          </div>
        </section>
      ) : null}

      <section className="sec">
        <div className="wrap">
          <SectionHead en="PROFILE" title={L("navProfile")} more={{ href: "/profile", label: L("more") }} />
          <div className="prof">
            <div>
              <h3>{L("overview")}</h3>
              <OverviewTable rows={overviewRows(data, lang).slice(0, 6)} />
            </div>
            <div>
              <h3>{L("history")}</h3>
              <History items={historyItems(data, lang).slice(-5)} />
            </div>
          </div>
        </div>
      </section>

      <CtaBand lang={lang} />
    </>
  )
}
