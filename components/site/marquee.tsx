const DEFAULT_ITEMS = [
  "NEXT.JS",
  "TYPESCRIPT",
  "MONGODB",
  "AI 통합 풀스택",
  "신지원 · SHIN JIWON",
  "BASED IN SEOUL",
  "OPEN TO WORK · 구직 중",
  "2026 PORTFOLIO",
]

const MIN_ITEMS = 6

export function Marquee({ items }: { items?: string[] }) {
  // 6개 미만이면 회전이 부자연스러워 기본 키워드로 대체
  const list = items && items.length >= MIN_ITEMS ? items : DEFAULT_ITEMS
  // 두 번 반복해 seamless loop
  const track = [...list, ...list]

  return (
    <div className="overflow-hidden border-y border-border bg-card py-4">
      <div className="flex whitespace-nowrap font-mono text-[13px] font-medium tracking-wider gap-12 animate-[marquee_40s_linear_infinite] will-change-transform">
        {track.map((s, i) => (
          <span key={i} className="inline-flex items-center gap-12 flex-shrink-0">
            {s}
            <span className="text-primary text-[6px]">●</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </div>
  )
}
