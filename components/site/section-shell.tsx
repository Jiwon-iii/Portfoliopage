import { cn } from "@/lib/utils"

/**
 * 9개 섹션 공통 컨테이너. 거대한 outlined 번호를 배경에 깔고
 * sec-head (좌 = 번호, 가운데 = 제목, 우 = aside) 패턴.
 */
export function SectionShell({
  num,
  totalNum = "08",
  title,
  subtitle,
  aside,
  numPosition = "right",
  children,
  id,
  className,
}: {
  num: string
  totalNum?: string
  title: string
  subtitle?: string
  aside?: React.ReactNode
  numPosition?: "left" | "right"
  children: React.ReactNode
  id?: string
  className?: string
}) {
  return (
    <section id={id} className={cn("relative py-24 border-t border-border overflow-hidden", className)}>
      {/* 거대 번호 (배경 그래픽) */}
      <div
        aria-hidden
        className={cn(
          "absolute top-14 pointer-events-none leading-[0.8] z-0",
          "font-serif font-extrabold tracking-[-0.08em]",
          "text-[clamp(220px,32vw,420px)]",
          "[color:transparent] [-webkit-text-stroke:1px_var(--border)]",
          "opacity-55",
          numPosition === "left" ? "-left-10" : "-right-10",
        )}
      >
        {num}
      </div>

      <div className="relative z-10 max-w-[1180px] mx-auto px-10">
        <div className="grid gap-10 mb-16 sm:grid-cols-[120px_1fr_200px] items-end">
          <div className="font-mono text-[13px] text-primary tracking-wider">
            {num}<span className="text-muted-foreground mx-1.5">/</span>{totalNum}
          </div>
          <h2 className="font-serif text-5xl font-extrabold tracking-tighter leading-none">
            {title}
            {subtitle && (
              <span className="block text-sm font-sans font-normal text-muted-foreground tracking-normal mt-2.5">
                {subtitle}
              </span>
            )}
          </h2>
          {aside && <div className="text-xs text-muted-foreground leading-relaxed text-right">{aside}</div>}
        </div>
        {children}
      </div>
    </section>
  )
}
