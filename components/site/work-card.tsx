import Link from "next/link"
import { Shot } from "./shot"
import { label, pickLang, type Lang } from "@/lib/i18n"
import type { Work } from "@/lib/schemas/work"

/** 실적 카드 — 메인·実績 페이지 공통. 사진이 없으면 제목을 크게 쓴 칸. */
export function WorkCard({ work, lang }: { work: Work; lang: Lang }) {
  const title = pickLang(work.title, lang)
  const image = work.images[0]
  return (
    <Link className="wk card" href={`/works/${work._id}`}>
      {image ? <Shot image={image} alt={title} /> : <div className="typetile">{title}</div>}
      <div className="cb">
        <div className="meta">
          {work.status === "in-progress" && <span className="chip live">{label("inProgress", lang)}</span>}
          {work.year && <span className="chip">{work.year}</span>}
        </div>
        <h3>{title}</h3>
        {work.tagline && <p>{pickLang(work.tagline, lang)}</p>}
        <div className="tags">
          {work.techs.slice(0, 4).map((t) => <span key={t}>{t}</span>)}
        </div>
      </div>
    </Link>
  )
}
