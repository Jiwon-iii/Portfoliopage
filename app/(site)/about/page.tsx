import type { Metadata } from "next"
import { PageHead } from "@/components/site/page-head"
import { SectionHead } from "@/components/site/section-head"
import { Marked } from "@/components/site/marked"
import { Values, Message, CtaBand } from "@/components/site/blocks"
import { getSiteLang } from "@/lib/site-lang"
import { label, pickLang } from "@/lib/i18n"
import { loadSite } from "@/lib/site-content"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const { lang } = await getSiteLang()
  return { title: label("navAbout", lang) }
}

export default async function AboutPage() {
  const [data, { lang }] = await Promise.all([loadSite(), getSiteLang()])
  const L = (k: Parameters<typeof label>[0]) => label(k, lang)
  const heading = pickLang(data.about?.heading, lang)
  return (
    <>
      <PageHead
        crumbs={[{ href: "/", label: L("home") }, { label: L("navAbout") }]}
        en="ABOUT"
        title={L("navAbout")}
        lead={pickLang(data.hero?.tagline, lang).replaceAll("*", "")}
        image={data.hero?.portrait}
        portrait
      />
      {heading && (
        <section className="sec">
          <div className="wrap">
            <SectionHead en="MISSION" title={L("mission")} />
            <p className="stmt"><Marked text={heading} /></p>
          </div>
        </section>
      )}
      <section className="sec alt">
        <div className="wrap">
          <SectionHead en="VALUES" title={L("values")} />
          <Values data={data} lang={lang} flush />
        </div>
      </section>
      {data.about?.paragraphs?.length ? (
        <section className="sec">
          <div className="wrap">
            <SectionHead en="MESSAGE" title={L("message")} />
            {/* 머리에 이미 증명사진이 있어 여기선 글만 */}
            <Message data={data} lang={lang} photo={false} />
          </div>
        </section>
      ) : null}
      <CtaBand lang={lang} />
    </>
  )
}
