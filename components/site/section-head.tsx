import Link from "next/link"

/** 섹션 머리: 영문 알약 라벨 + 제목 (+ 오른쪽 「詳しく見る」). */
export function SectionHead({ en, title, more }: { en: string; title: string; more?: { href: string; label: string } }) {
  return (
    <div className="sh">
      <div>
        <p className="sh-en">{en}</p>
        <h2>{title}</h2>
      </div>
      {more && <Link className="more" href={more.href}>{more.label}</Link>}
    </div>
  )
}
