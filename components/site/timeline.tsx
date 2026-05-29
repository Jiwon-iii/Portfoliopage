import { SectionShell } from "./section-shell"
import { pickLang, type Lang } from "@/lib/i18n"

export type TimelineItem = {
  _id: string
  period: { start: string; end: string }
  title: { ko: string; ja?: string | null; en?: string | null }
  where?: { ko?: string | null; ja?: string | null; en?: string | null }
  note?: { ko?: string | null; ja?: string | null; en?: string | null }
}

export function TimelineSection({
  num,
  totalNum,
  numPosition = "right",
  title,
  subtitle,
  aside,
  items,
  lang = "ko",
  emptyMessage,
}: {
  num: string
  totalNum?: string
  numPosition?: "left" | "right"
  title: string
  subtitle?: string
  aside?: React.ReactNode
  items: TimelineItem[]
  lang?: Lang
  emptyMessage: string
}) {
  return (
    <SectionShell num={num} totalNum={totalNum} numPosition={numPosition} title={title} subtitle={subtitle} aside={aside}>
      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        <div>
          {items.map((it) => (
            <div key={it._id} className="grid grid-cols-[140px_1fr] gap-12 py-6 border-b border-border items-start">
              <div className="font-mono text-[11px] text-primary tracking-wider pt-1">
                {it.period.start} — {it.period.end}
              </div>
              <div>
                <h4 className="font-serif text-xl font-bold tracking-tight mb-1">{pickLang(it.title, lang)}</h4>
                {it.where && (
                  <div className="font-italic italic text-sm text-muted-foreground mb-2">
                    {pickLang(it.where, lang)}
                  </div>
                )}
                {it.note && (
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
                    {pickLang(it.note, lang)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionShell>
  )
}
