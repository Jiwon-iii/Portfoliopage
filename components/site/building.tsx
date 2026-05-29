import { SectionShell } from "./section-shell"
import { WorkDetail } from "./work-detail"
import type { Lang } from "@/lib/i18n"
import type { Work } from "@/lib/schemas/work"

/**
 * "진행 중" 작품들도 영웅 프로젝트와 동일한 디테일 레이아웃.
 * 비주얼에 "진행 중" 배지 자동 표시.
 */
export function BuildingSection({ items, lang = "ko" }: { items: Work[]; lang?: Lang }) {
  if (items.length === 0) {
    return (
      <SectionShell num="03" totalNum="08" title="진행 중" subtitle="지금 만들고 있는 것" aside={<>LIVE PROGRESS<br/>UPDATED WEEKLY</>}>
        <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
          진행 중인 작업이 아직 추가되지 않았어요.
        </div>
      </SectionShell>
    )
  }

  return (
    <SectionShell
      num="03" totalNum="08"
      title="진행 중"
      subtitle="지금 만들고 있는 것"
      aside={<>LIVE PROGRESS<br/>{items.length} BUILDING</>}
    >
      <div className="border-t-2 border-foreground">
        {items.map((w, i) => (
          <WorkDetail
            key={w._id}
            work={w}
            lang={lang}
            index={i}
            caseLabel={`IN PROGRESS · ${String(i + 1).padStart(3, "0")} · ${(w.techs[0] ?? "BUILDING").toUpperCase()}`}
          />
        ))}
      </div>
    </SectionShell>
  )
}
