import { ArrowUpRight } from "lucide-react"
import { SectionShell } from "./section-shell"
import { pickLang, type Lang } from "@/lib/i18n"
import type { Work } from "@/lib/schemas/work"

/**
 * "그 외 프로젝트" — 연습용·간략한 작품들.
 * 메인 프로젝트와 같은 풀폭 디테일이 아니라 한 줄짜리 컴팩트 리스트.
 */
export function PracticeSection({ works, lang = "ko" }: { works: Work[]; lang?: Lang }) {
  if (works.length === 0) {
    return null // 콘텐츠 없으면 섹션 자체를 숨김
  }

  return (
    <SectionShell
      num="02"
      totalNum="07"
      numPosition="left"
      title="그 외 프로젝트"
      subtitle="연습·토이 작업물"
      aside={<>PRACTICE WORKS<br/>{works.length} ITEMS</>}
    >
      <div className="border-t-2 border-foreground">
        {works.map((w, i) => {
          const num = String(i + 1).padStart(3, "0")
          const title = pickLang(w.title, lang)
          const tagline = pickLang(w.tagline, lang)
          const link = w.liveUrl
          const Wrapper = link ? "a" : "div"

          return (
            <Wrapper
              key={w._id}
              {...(link
                ? {
                    href: link,
                    target: link.startsWith("http") ? "_blank" : undefined,
                    rel: "noreferrer",
                  }
                : {})}
              className="group grid grid-cols-[60px_1fr_180px_70px_30px] gap-6 py-6 border-b border-border items-center transition-[padding] hover:pl-4"
            >
              <span className="font-mono text-[13px] text-primary tracking-wider">{num}</span>
              <div>
                <h4 className="font-serif text-xl font-bold tracking-tight">{title}</h4>
                {tagline && <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{tagline}</p>}
              </div>
              <div className="font-mono text-[11px] text-muted-foreground tracking-wider hidden md:block">
                {w.techs.slice(0, 3).join(" · ")}
              </div>
              <div className="font-mono text-[11px] text-muted-foreground text-right hidden md:block">
                {w.year ?? ""}
              </div>
              <div className="flex justify-end">
                {w.liveUrl ? (
                  <ArrowUpRight className="h-4 w-4 text-foreground group-hover:text-primary group-hover:translate-x-1 transition" />
                ) : (
                  <span className="w-4 h-4" />
                )}
              </div>
            </Wrapper>
          )
        })}
      </div>
    </SectionShell>
  )
}
