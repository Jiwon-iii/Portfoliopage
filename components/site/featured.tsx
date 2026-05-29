import { SectionShell } from "./section-shell"
import { WorkDetail } from "./work-detail"
import type { Lang } from "@/lib/i18n"
import type { Work } from "@/lib/schemas/work"

export function FeaturedSection({ work, lang = "ko" }: { work: Work | null; lang?: Lang }) {
  if (!work) {
    return (
      <SectionShell
        id="work"
        num="01"
        title="영웅 프로젝트"
        subtitle="대표 작품 한 가지"
        aside={<>SELECTED CASE STUDY<br/>2024 — PRESENT</>}
      >
        <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
          영웅 프로젝트가 아직 추가되지 않았어요. 어드민에서 type=&quot;featured&quot; 로 추가하면 여기에 나타납니다.
        </div>
      </SectionShell>
    )
  }

  return (
    <SectionShell
      id="work"
      num="01"
      title="영웅 프로젝트"
      subtitle="대표 작품 한 가지"
      aside={<>SELECTED CASE STUDY<br/>2024 — PRESENT</>}
    >
      <WorkDetail work={work} lang={lang} index={0} caseLabel="CASE 001 · AI 통합 풀스택" />
    </SectionShell>
  )
}
