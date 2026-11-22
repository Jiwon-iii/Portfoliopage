import { Fragment } from "react"

/**
 * 실적 상세 본문. 어드민 입력은 간단한 마크다운이라 필요한 것만 처리:
 *  - "## 제목" 줄 → 소제목
 *  - **굵게** → 굵은 글씨 (예전엔 별표가 그대로 보였음)
 *  - 빈 줄 → 문단 나눔, 그 외 줄바꿈은 그대로
 */
export function RichText({ text }: { text: string }) {
  const blocks = text.trim().split(/\n\s*\n/)
  return (
    <div className="rich">
      {blocks.map((block, i) => {
        const lines = block.split("\n")
        const heading = lines[0].match(/^#{1,6}\s+(.*)$/)
        const body = (heading ? lines.slice(1) : lines).join("\n")
        return (
          <Fragment key={i}>
            {heading && <h3>{bold(heading[1])}</h3>}
            {body.trim() && <p>{bold(body)}</p>}
          </Fragment>
        )
      })}
    </div>
  )
}

function bold(s: string) {
  return s.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? <strong key={i}>{part.slice(2, -2)}</strong> : part,
  )
}
