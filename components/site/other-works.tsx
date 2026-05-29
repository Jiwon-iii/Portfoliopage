import { SectionShell } from "./section-shell"
import { WorkDetail } from "./work-detail"
import type { Lang } from "@/lib/i18n"
import type { Work } from "@/lib/schemas/work"

/**
 * 모든 작품을 영웅 프로젝트와 같은 디테일 레이아웃으로 표시.
 * 짝수번째 = 이미지 왼쪽, 홀수번째 = 이미지 오른쪽 (zig-zag).
 */
export function OtherWorksSection({ works, lang = "ko" }: { works: Work[]; lang?: Lang }) {
  if (works.length === 0) {
    return (
      <SectionShell
        num="02"
        numPosition="left"
        title="그 외 작업"
        subtitle="모든 프로젝트 상세"
        aside={<>PROJECTS<br/>ALL DETAILED</>}
      >
        <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
          그 외 작업이 아직 추가되지 않았어요.
        </div>
      </SectionShell>
    )
  }

  return (
    <SectionShell
      num="02"
      numPosition="left"
      title="그 외 작업"
      subtitle="모든 프로젝트 상세"
      aside={<>PROJECTS<br/>{works.length} TOTAL</>}
    >
      <div className="border-t-2 border-foreground">
        {works.map((w, i) => (
          <WorkDetail
            key={w._id}
            work={w}
            lang={lang}
            index={i + 1}
            caseLabel={`CASE ${String(i + 2).padStart(3, "0")} · ${pickCaseSubtitle(w)}`}
          />
        ))}
      </div>
    </SectionShell>
  )
}

function pickCaseSubtitle(w: Work): string {
  return w.techs[0]?.toUpperCase() ?? "PROJECT"
}
