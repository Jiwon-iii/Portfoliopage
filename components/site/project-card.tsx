import { GitBranch, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ProjectImageSlider } from "@/components/site/project-image-slider"
import { pickLang, type Lang } from "@/lib/i18n"
import type { Work } from "@/lib/schemas/work"

/**
 * 작품 1개를 자세히 보여주는 카드.
 * 모든 프로젝트에 균등하게 적용 — Featured 영웅이 아닌 작품도 충분한 정보로 표시.
 *
 * variant:
 *  - 'wide' = 그리드 안에서 가로로 폭 잡고 좌우 분할 (이미지 좌·텍스트 우)
 *  - 'card' = 일반 그리드 카드 (이미지 위·텍스트 아래)
 */
export function ProjectCard({
  work,
  lang = "ko",
  variant = "card",
  index = 0,
}: {
  work: Work
  lang?: Lang
  variant?: "wide" | "card"
  index?: number
}) {
  const title = pickLang(work.title, lang)
  const tagline = pickLang(work.tagline, lang)
  const description = pickLang(work.description, lang)
  const images = work.images ?? []
  const num = String(index + 1).padStart(3, "0")

  if (variant === "wide") {
    // 좌우 분할 — 짝수 index 는 이미지 왼쪽, 홀수는 이미지 오른쪽 (zig-zag)
    const imageRight = index % 2 === 1
    return (
      <article
        className="grid lg:grid-cols-2 gap-10 py-12 border-b border-border last:border-b-0"
      >
        <ProjectImageSlider
          images={images}
          alt={title}
          ratio="4 / 3"
          sizes="(max-width: 768px) 100vw, 50vw"
          className={imageRight ? "lg:order-2" : ""}
        />

        <div className="flex flex-col justify-center">
          <div className="font-mono text-[11px] text-primary tracking-wider mb-3">
            {num}{work.year && <span className="text-muted-foreground ml-2">· {work.year}</span>}
          </div>
          <h3 className="font-serif text-3xl font-extrabold tracking-tighter leading-tight mb-2">{title}</h3>
          {tagline && (
            <div className="font-italic italic text-base text-muted-foreground mb-4">&ldquo;{tagline}&rdquo;</div>
          )}

          <div className="flex flex-wrap gap-1.5 mb-5">
            {work.techs.map((t) => (
              <Badge key={t} variant="outline" className="font-mono text-[10px] tracking-wider">{t}</Badge>
            ))}
          </div>

          {description && (
            <p className="text-[14px] text-muted-foreground leading-relaxed mb-5 line-clamp-4 whitespace-pre-line">
              {description}
            </p>
          )}

          <div className="flex gap-2 pt-4 border-t border-border">
            {work.liveUrl && (
              <a
                href={work.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wider px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
              >
                라이브 <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}
            {work.githubUrl && (
              <a
                href={work.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wider px-3 py-2 border border-border rounded-md hover:border-foreground transition"
              >
                <GitBranch className="h-3.5 w-3.5" /> GitHub
              </a>
            )}
          </div>
        </div>
      </article>
    )
  }

  // 일반 카드
  return (
    <article className="group flex flex-col bg-card border border-border rounded-md overflow-hidden hover:border-foreground transition-colors">
      <div className="relative">
        <ProjectImageSlider
          images={images}
          alt={title}
          ratio="16 / 9"
          sizes="(max-width: 768px) 100vw, 50vw"
          className="border-0 rounded-none"
        />
        {work.year && (
          <div className="absolute top-3 right-3 z-10 font-mono text-[10px] tracking-wider bg-background/85 backdrop-blur px-2 py-1 rounded text-foreground">
            {work.year}
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col p-6">
        <div className="font-mono text-[10px] text-primary tracking-wider mb-2">{num}</div>
        <h3 className="font-serif text-xl font-bold tracking-tight mb-1">{title}</h3>
        {tagline && <p className="text-sm text-muted-foreground mb-4">{tagline}</p>}

        {description && (
          <p className="text-[13px] text-muted-foreground leading-relaxed mb-4 line-clamp-3 whitespace-pre-line">
            {description}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5 mb-4">
          {work.techs.map((t) => (
            <Badge key={t} variant="outline" className="font-mono text-[10px] tracking-wider">{t}</Badge>
          ))}
        </div>

        <div className="mt-auto pt-3 border-t border-border flex gap-2">
          {work.liveUrl && (
            <a href={work.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-mono text-[11px] tracking-wider text-foreground hover:text-primary">
              라이브 <ArrowUpRight className="h-3 w-3" />
            </a>
          )}
          {work.githubUrl && (
            <a href={work.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-mono text-[11px] tracking-wider text-foreground hover:text-primary ml-auto">
              <GitBranch className="h-3 w-3" /> GitHub
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
