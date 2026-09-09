import { SectionShell } from "./section-shell"
import { ProjectImageSlider } from "./project-image-slider"
import { label, pickLang, type Lang } from "@/lib/i18n"
import type { About } from "@/lib/schemas/about"

const FALLBACK_PARAGRAPHS = [
  { ko: "Next.js로 풀스택 웹을 만들고 MongoDB로 데이터를 다루며, 지금은 기계학습을 공부하면서 AI 기능을 제품에 직접 붙여보고 있습니다.", ja: "", en: "" },
  { ko: "한 가지 기술에 머무르기보다 경계를 넘나들며 익히는 걸 즐깁니다. 앞으로 만들고 싶은 건, 사용자가 AI를 의식하지 않을 만큼 자연스럽게 동작하는 웹 제품입니다.", ja: "", en: "" },
  { ko: "이 사이트도 어드민까지 직접 설계해 만든 풀스택 작업물입니다.", ja: "", en: "" },
]

const FALLBACK_HEADING = { ko: "*AI가 자연스럽게 녹아든 웹*을 만들고 싶습니다.", ja: "", en: "" }

export function AboutSection({ about, lang = "ko" }: { about: About | null; lang?: Lang }) {
  const heading = pickLang(about?.heading || FALLBACK_HEADING, lang)
  const paragraphs = about?.paragraphs?.length ? about.paragraphs : FALLBACK_PARAGRAPHS
  const images = about?.images ?? []
  const headingParts = heading.split(/(\*[^*]+\*)/g)

  return (
    <SectionShell id="about" num="03" totalNum="07" numPosition="left" title={label("sectionAbout", lang)} subtitle={label("sectionAboutSub", lang)} aside={<>PROFILE<br/>SHIN JIWON</>}>
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-15 items-start">
        <div>
          <h3 className="font-serif text-4xl font-extrabold tracking-tight leading-snug mb-8">
            {headingParts.map((part, i) =>
              part.startsWith("*") ? (
                <em key={i} className="font-italic not-italic italic text-primary font-normal">
                  {part.slice(1, -1)}
                </em>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </h3>
          <div className="space-y-4 max-w-2xl">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-[15px] text-muted-foreground leading-loose">
                {pickLang(p, lang)}
              </p>
            ))}
          </div>
        </div>

        {/* 자기소개 사진 — 여러 장이면 슬라이더 */}
        <ProjectImageSlider images={images} alt="자기소개" ratio="3 / 4" sizes="(max-width: 768px) 100vw, 40vw" />
      </div>
    </SectionShell>
  )
}
