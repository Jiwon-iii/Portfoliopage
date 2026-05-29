import { SectionShell } from "./section-shell"
import { label, type Lang } from "@/lib/i18n"
import type { Skill, SkillCategory } from "@/lib/schemas/skill"

const CATEGORY_LABEL_KEY: Record<SkillCategory, "skillMain" | "skillUsable"> = {
  main: "skillMain",
  usable: "skillUsable",
}

export function SkillsSection({
  skills,
  lang = "ko",
}: {
  skills: Record<SkillCategory, Skill[]>
  lang?: Lang
}) {
  const empty = Object.values(skills).every((arr) => arr.length === 0)

  return (
    <SectionShell num="06" totalNum="07" title={label("sectionSkills", lang)} subtitle={label("stack", lang)} aside={<>STACK</>}>
      {empty ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
          {label("emptySkills", lang)}
        </div>
      ) : (
        <div className="border-t-2 border-foreground pt-10 space-y-8">
          {(Object.keys(skills) as SkillCategory[]).map((cat) => {
            const list = skills[cat]
            if (list.length === 0) return null
            return (
              <div
                key={cat}
                className="grid sm:grid-cols-[180px_1fr] gap-x-8 gap-y-3 items-baseline border-b border-border pb-6 last:border-b-0"
              >
                <div className="font-mono text-[12px] text-primary tracking-widest font-semibold uppercase">
                  {label(CATEGORY_LABEL_KEY[cat], lang)}
                </div>
                <p className="font-serif text-base font-medium leading-relaxed">
                  {list.map((s, i) => (
                    <span key={s._id}>
                      {s.name}
                      {i < list.length - 1 && (
                        <span className="mx-2.5 text-muted-foreground font-sans font-normal">·</span>
                      )}
                    </span>
                  ))}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </SectionShell>
  )
}
