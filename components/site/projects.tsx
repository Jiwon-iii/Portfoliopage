import { SectionShell } from "./section-shell"
import { WorkDetail } from "./work-detail"
import { label, type Lang } from "@/lib/i18n"
import type { Work } from "@/lib/schemas/work"

/**
 * 모든 프로젝트를 한 섹션에 통합. 영웅/그 외 구분 없음.
 * 각 작품이 같은 풀폭 디테일 레이아웃 (좌측 비주얼 + 우측 케이스 스터디).
 * 짝수번째 = 이미지 왼쪽, 홀수번째 = 이미지 오른쪽 (zig-zag).
 */
export function ProjectsSection({ works, lang = "ko" }: { works: Work[]; lang?: Lang }) {
  if (works.length === 0) {
    return (
      <SectionShell
        id="work"
        num="01"
        totalNum="07"
        title={label("sectionProjects", lang)}
        subtitle={label("sectionProjectsSub", lang)}
        aside={<>SELECTED WORKS<br/>ALL DETAILED</>}
      >
        <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
          {label("emptyWorks", lang)}
        </div>
      </SectionShell>
    )
  }

  return (
    <SectionShell
      id="work"
      num="01"
      totalNum="07"
      title={label("sectionProjects", lang)}
      subtitle={label("sectionProjectsSub", lang)}
      aside={<>SELECTED WORKS<br/>{works.length} TOTAL</>}
    >
      <div className="border-t-2 border-foreground">
        {works.map((w, i) => (
          <WorkDetail
            key={w._id}
            work={w}
            lang={lang}
            index={i}
            caseLabel={`CASE ${String(i + 1).padStart(3, "0")} · ${pickCaseSubtitle(w)}`}
          />
        ))}
      </div>
    </SectionShell>
  )
}

function pickCaseSubtitle(w: Work): string {
  if (w.status === "in-progress") return "IN PROGRESS"
  return w.techs[0]?.toUpperCase() ?? "PROJECT"
}
