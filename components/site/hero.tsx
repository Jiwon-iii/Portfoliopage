import Image from "next/image"
import { label, pickLang, type Lang } from "@/lib/i18n"
import type { Hero } from "@/lib/schemas/hero"

const FALLBACK = {
  name: { ko: "신지원", ja: "シン・ジウォン", en: "Shin Jiwon" },
  tagline: { ko: "Next.js로 풀스택 웹을 만들고, 거기에 AI를 자연스럽게 녹여내는 개발자.", ja: "", en: "" },
  metaLeft: { ko: "포트폴리오 · 2026 · 개발자", ja: "", en: "" },
  location: { ko: "서울", ja: "", en: "" },
  focus: { ko: "AI × 풀스택", ja: "", en: "" },
  status: { ko: "구직 중", ja: "", en: "" },
  github: "https://github.com/Jiwon-iii",
  email: "syrima03@gmail.com",
  portrait: null,
} as const

export function HeroSection({ hero, lang = "ko" }: { hero: Hero | null; lang?: Lang }) {
  const h = hero ?? (FALLBACK as unknown as Hero)
  const name = pickLang(h.name, lang)
  const tagline = pickLang(h.tagline, lang)
  const metaLeft = pickLang(h.metaLeft, lang)
  const location = pickLang(h.location, lang)
  const focus = pickLang(h.focus, lang)
  const status = pickLang(h.status, lang)

  // tagline 에서 *AI* 같은 이탤릭 강조 처리 (단순 *...* 패턴)
  const taglineParts = tagline.split(/(\*[^*]+\*)/g)

  return (
    <section className="relative min-h-[calc(100svh-110px)] flex items-center overflow-hidden">
      {/* 거대 배경 텍스트 */}
      <div
        aria-hidden
        className="absolute bottom-14 -right-8 pointer-events-none font-italic italic text-primary opacity-[0.07] leading-none -rotate-[4deg]"
        style={{ fontSize: "clamp(160px, 18vw, 260px)", letterSpacing: "-0.03em" }}
      >
        developer.
      </div>

      <div className="relative z-10 max-w-[1180px] mx-auto px-10 grid lg:grid-cols-[1fr_360px] gap-44 items-start">
        {/* LEFT: 이름 + 태그라인 + 메타 */}
        <div className="pt-6">
          <div className="text-[11px] font-mono text-muted-foreground tracking-wider mb-6 flex items-center gap-4">
            <span>{metaLeft || "포트폴리오 · 2026 · 개발자"}</span>
            <span className="flex-1 h-px bg-border" />
          </div>

          <h1
            className={`font-serif font-semibold tracking-[-0.03em] leading-[1.05] mb-3 ${
              // 일본어 이름(예: シン・ジウォン)은 글자 폭이 넓고 길어 KR보다 작게 잡아야 한 줄에 들어감
              lang === "ja"
                ? "text-[clamp(40px,8vw,76px)]"
                : "text-[clamp(72px,11vw,144px)]"
            }`}
          >
            {name}
          </h1>
          <div className="font-italic italic text-3xl text-muted-foreground tracking-tight">
            Shin Jiwon
          </div>

          <div className="mt-12 max-w-xl">
            <div className="text-xs text-primary font-medium mb-3">{label("heroIntro", lang)}</div>
            <h2 className="font-serif text-3xl font-bold tracking-tight leading-normal">
              {taglineParts.map((part, i) =>
                part.startsWith("*") && part.endsWith("*") ? (
                  <em key={i} className="font-italic not-italic italic text-primary font-normal">
                    {part.slice(1, -1)}
                  </em>
                ) : (
                  <span key={i}>{part}</span>
                ),
              )}
            </h2>
          </div>

          {/* 메타 한 줄 */}
          <div className="mt-8 flex flex-wrap items-center gap-2.5 text-sm text-muted-foreground">
            {location && <span>{location}</span>}
            <span className="text-muted-foreground/50">·</span>
            {focus && <span>{focus}</span>}
            <span className="text-muted-foreground/50">·</span>
            {status && <span className="text-primary font-semibold">{status}</span>}
            <span className="text-muted-foreground/50">·</span>
            <a
              href={h.github || "#"}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs text-foreground hover:text-primary hover:underline"
            >
              {(h.github || "").replace(/^https?:\/\//, "")}
            </a>
          </div>
        </div>

        {/* RIGHT: 증명사진 */}
        <div className="relative aspect-[4/5] rounded-md overflow-hidden border border-border shadow-md bg-gradient-to-br from-card to-secondary">
          {/* 메타 라벨 — 이름만 */}
          <div className="absolute top-3.5 right-3.5 z-30 font-mono text-[10px] font-semibold tracking-wider bg-background/80 backdrop-blur px-2.5 py-1 rounded">
            {name} / SHIN JIWON
          </div>

          {/* 사진 또는 placeholder */}
          {h.portrait?.url ? (
            <Image
              src={h.portrait.url}
              alt={h.portrait.alt || `${name} 증명사진`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 360px"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-muted-foreground p-8 text-center">
              <svg viewBox="0 0 100 120" className="w-20 opacity-30" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="50" cy="42" r="18" />
                <path d="M20 110 Q20 80 50 80 Q80 80 80 110" />
              </svg>
              <div>
                <div className="font-serif font-bold text-foreground">증명사진 자리</div>
                <div className="font-mono text-[11px] mt-1.5">어드민에서 업로드</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
