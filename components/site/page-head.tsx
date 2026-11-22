import Link from "next/link"
import { Shot } from "./shot"
import type { ImageRef } from "@/lib/schemas/i18n-field"

/** 하위 페이지 머리: 경로 + 제목 + 설명 + 오른쪽 사진, 또는 배너 전체에 까는 그림(art). */
export function PageHead({
  crumbs,
  en,
  title,
  lead,
  image,
  portrait,
  art,
}: {
  crumbs: { href?: string; label: string }[]
  en: string
  title: string
  lead?: string
  image?: ImageRef | null
  portrait?: boolean // 증명사진: 자르지 않고 세로(3:4) 그대로
  art?: React.ReactNode
}) {
  return (
    <section className={art ? "pt has-art" : image ? "pt has-img" : "pt"}>
      {art}
      <div className="wrap">
        <div>
          <p className="crumb">
            {crumbs.map((c, i) => (
              <span key={i}>
                {i > 0 && " ／ "}
                {c.href ? <Link href={c.href}>{c.label}</Link> : c.label}
              </span>
            ))}
          </p>
          <p className="sh-en">{en}</p>
          <h1>{title}</h1>
          {lead && <p className="lead">{lead}</p>}
        </div>
        {!art && image && (
          <Shot image={image} alt={title} className={portrait ? "pt-img portrait" : "pt-img"} sizes="(max-width: 860px) 100vw, 45vw" priority />
        )}
      </div>
    </section>
  )
}
