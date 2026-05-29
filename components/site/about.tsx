import { SectionShell } from "./section-shell"
import { pickLang, type Lang } from "@/lib/i18n"
import type { About } from "@/lib/schemas/about"

const FALLBACK_PARAGRAPHS = [
  { ko: "Next.js로 풀스택 웹을 만들고, MongoDB로 데이터를 조작하고, 지금은 기계학습 공부와 AI 기능 통합에 집중하고 있습니다.", ja: "", en: "" },
  { ko: "기술 사이 경계를 넘는 호기심을 가지고 있습니다. 다음 자리에서 만들고 싶은 건 AI가 자연스럽게 박혀있는 웹 제품입니다.", ja: "", en: "" },
]

const FALLBACK_HEADING = { ko: "웹을 만들면서 *AI를 함께* 박아넣는 작업을 합니다.", ja: "", en: "" }

export function AboutSection({ about, lang = "ko" }: { about: About | null; lang?: Lang }) {
  const heading = pickLang(about?.heading || FALLBACK_HEADING, lang)
  const paragraphs = about?.paragraphs?.length ? about.paragraphs : FALLBACK_PARAGRAPHS
  const headingParts = heading.split(/(\*[^*]+\*)/g)

  return (
    <SectionShell id="about" num="03" totalNum="07" numPosition="left" title="소개" subtitle="신지원에 대하여" aside={<>PROFILE<br/>SHIN JIWON</>}>
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

        {/* 포트레이트 우측 디자인 박스 */}
        <div className="relative aspect-[3/4] rounded-md overflow-hidden border border-border bg-gradient-to-br from-card via-secondary to-secondary p-6 flex items-end">
          <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center font-italic italic text-[200px] text-foreground opacity-10 leading-none tracking-tighter"
          >
            JW
          </div>
          <div className="absolute top-6 right-6 w-12 h-12 rounded-full border-2 border-primary opacity-60" />
          <div className="font-mono text-[10px] tracking-widest text-primary font-semibold z-10">
            <div className="w-6 h-px bg-primary mb-1.5" />
            PORTRAIT
            <br />NO.001
          </div>
          <div className="ml-auto font-mono text-[11px] z-10 text-foreground">
            초상 · 2026
            <br />
            <span className="font-serif text-base font-extrabold tracking-tight">신지원</span>
            <br />
            <span className="font-italic italic text-primary text-[13px]">Shin Jiwon, dev.</span>
          </div>
        </div>
      </div>
    </SectionShell>
  )
}
