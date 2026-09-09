import { SectionShell } from "./section-shell"
import { label, type Lang } from "@/lib/i18n"
import type { Skill, SkillCategory } from "@/lib/schemas/skill"

export function SkillsSection({
  skills,
  lang = "ko",
}: {
  skills: Record<SkillCategory, Skill[]>
  lang?: Lang
}) {
  // 주력/사용가능 구분 없이 하나의 목록으로 합쳐 표시
  const all = (Object.keys(skills) as SkillCategory[]).flatMap((cat) => skills[cat])

  return (
    <SectionShell num="06" totalNum="07" title={label("sectionSkills", lang)} subtitle={label("stack", lang)} aside={<>STACK</>}>
      {all.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
          {label("emptySkills", lang)}
        </div>
      ) : (
        <div className="border-t-2 border-foreground pt-10">
          <p className="font-serif text-base font-medium leading-relaxed">
            {all.map((s, i) => (
              <span key={s._id}>
                {s.name}
                {i < all.length - 1 && (
                  <span className="mx-2.5 text-muted-foreground font-sans font-normal">·</span>
                )}
              </span>
            ))}
          </p>
        </div>
      )}
    </SectionShell>
  )
}
