import { ArrowRight } from "lucide-react"
import type { Hero } from "@/lib/schemas/hero"

export function ContactSection({ hero }: { hero: Hero | null }) {
  const email = hero?.email || "syrima03@gmail.com"
  const emailSecondary = hero?.emailSecondary || "syrima03@naver.com"
  const github = hero?.github || "https://github.com/Jiwon-iii"

  return (
    <section id="contact" className="py-36 text-center border-t border-border">
      <div className="max-w-[1180px] mx-auto px-10">
        <div className="text-xs text-primary tracking-wider font-semibold mb-8">
          — LET&apos;S BUILD SOMETHING TOGETHER
        </div>
        <h2 className="font-serif text-[clamp(64px,9vw,128px)] font-black tracking-tighter leading-none mb-12">
          함께 <em className="font-italic not-italic italic text-primary font-normal">만들어봐요</em>
        </h2>
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-3.5 font-mono text-base tracking-wider border border-foreground px-8 py-4 hover:bg-foreground hover:text-background transition-colors"
        >
          {email}
          <ArrowRight className="h-4 w-4" />
        </a>
        <div className="mt-10 flex justify-center gap-8 text-sm text-muted-foreground">
          <a href={github} target="_blank" rel="noreferrer" className="hover:text-primary">
            → 깃허브 / JIWON-III
          </a>
          {emailSecondary && (
            <a href={`mailto:${emailSecondary}`} className="hover:text-primary">
              → 네이버 메일
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

export function SiteFooter() {
  return (
    <footer className="py-8 border-t border-border bg-card">
      <div className="max-w-[1180px] mx-auto px-10 flex flex-wrap justify-between items-center gap-4 text-[11px] text-muted-foreground">
        <div className="flex gap-3 items-baseline">
          <span>© 2026 신지원</span>
          <span className="font-serif text-[10px] opacity-60">シン・ジウォン</span>
        </div>
        <div className="font-mono tracking-wider">
          NEXT.JS · TYPESCRIPT · MONGODB · TAILWIND
        </div>
      </div>
    </footer>
  )
}
