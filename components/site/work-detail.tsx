import { ArrowUpRight, Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProjectImageSlider } from "@/components/site/project-image-slider"
import { label, pickLang, type Lang } from "@/lib/i18n"
import type { Work } from "@/lib/schemas/work"

/**
 * 작품 1개를 "영웅 프로젝트처럼" 자세히 보여주는 컴포넌트.
 *  - 좌측: 큰 비주얼 (4/5 비율) — 짝수번째는 좌측, 홀수번째는 우측 (zig-zag)
 *  - 우측: 케이스 라벨 / 제목 / 한 줄 인용 / 기술 태그 / PROBLEM·APPROACH·OUTCOME / 버튼
 *
 * PROBLEM/APPROACH/OUTCOME 가 비어있으면 description 단락으로 대체 표시.
 */
export function WorkDetail({
  work,
  lang = "ko",
  index = 0,
  caseLabel,
}: {
  work: Work
  lang?: Lang
  index?: number
  /** 예: "CASE 001 · AI 통합 풀스택" / "IN PROGRESS · 진행 중" */
  caseLabel?: string
}) {
  const title = pickLang(work.title, lang)
  const tagline = pickLang(work.tagline, lang)
  const description = pickLang(work.description, lang)
  const sections = (work.sections ?? [])
    .map((s) => ({ title: pickLang(s.title, lang), body: pickLang(s.body, lang) }))
    .filter((s) => s.title || s.body)
  const images = work.images ?? []
  const num = String(index + 1).padStart(3, "0")
  const imageRight = index % 2 === 1
  const hasCaseStudy = sections.length > 0
  const defaultLabel =
    work.status === "in-progress"
      ? `IN PROGRESS · ${num}`
      : `CASE ${num}`

  return (
    <article className="grid lg:grid-cols-2 gap-15 py-20 border-b border-border last:border-b-0">
      {/* 비주얼 — 설명이 길어 행 높이가 늘어나면 이미지를 세로 가운데로 */}
      <div className={`flex items-center ${imageRight ? "lg:order-2" : ""}`}>
        <div className="relative w-full">
          <ProjectImageSlider
            images={images}
            alt={title}
            ratio="4 / 5"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {work.status === "in-progress" && (
            <div className="absolute top-4 left-4 z-20 font-mono text-[10px] tracking-widest bg-primary text-primary-foreground px-2.5 py-1 rounded flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {label("inProgress", lang)}
            </div>
          )}
          {work.year && (
            <div className="absolute bottom-4 right-4 z-20 font-mono text-[10px] tracking-widest bg-background/85 backdrop-blur text-foreground px-2.5 py-1 rounded">
              {work.year}
            </div>
          )}
        </div>
      </div>

      {/* 케이스 스터디 */}
      <div className="flex flex-col justify-center">
        <div className="font-mono text-[11px] text-muted-foreground tracking-wider mb-4">
          {caseLabel ?? defaultLabel}
        </div>
        <h3 className="font-serif text-4xl font-black tracking-tighter leading-tight mb-2">{title}</h3>
        {tagline && (
          <div className="font-italic italic text-lg text-muted-foreground mb-7">&ldquo;{tagline}&rdquo;</div>
        )}

        <div className="flex flex-wrap gap-2 mb-7">
          {work.techs.map((t, i) => (
            <Badge
              key={t}
              variant={i === 0 ? "default" : "outline"}
              className="font-mono text-[10px] tracking-wider"
            >
              {t}
            </Badge>
          ))}
        </div>

        {hasCaseStudy ? (
          <dl className="space-y-5 mb-7">
            {sections.map((s, i) => (
              <div key={i}>
                {s.title && (
                  <dt className="font-semibold text-primary text-xs flex items-center gap-2.5 mb-1.5">
                    <span className="w-3.5 h-px bg-primary" /> {s.title}
                  </dt>
                )}
                {s.body && (
                  <dd className="text-[15px] leading-relaxed pl-6 whitespace-pre-line">{s.body}</dd>
                )}
              </div>
            ))}
          </dl>
        ) : description ? (
          <div className="mb-7">
            <div className="font-semibold text-primary text-xs flex items-center gap-2.5 mb-1.5">
              <span className="w-3.5 h-px bg-primary" /> {label("description", lang)}
            </div>
            <p className="text-[15px] leading-relaxed pl-6 text-foreground whitespace-pre-line">{description}</p>
          </div>
        ) : null}

        {(work.liveUrl || work.liveLabel) && (
          <div className="flex gap-3 pt-6 border-t border-border">
            {work.liveUrl ? (
              <Button asChild>
                <a href={work.liveUrl} target="_blank" rel="noreferrer">
                  {work.liveLabel || label("viewMore", lang)} <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
            ) : (
              // URL 없이 버튼 이름만 — 클릭 불가 텍스트 (예: 기업 의뢰 · 비공개)
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground border border-border rounded-md px-4 py-2">
                <Lock className="h-3.5 w-3.5" />
                {work.liveLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
