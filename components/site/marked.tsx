/** "*단어*" 를 형광펜 강조로. 어드민 문구에서 강조할 곳을 별표로 표시한다. */
export function Marked({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/g).map((part, i) =>
        part.length > 2 && part.startsWith("*") && part.endsWith("*") ? (
          <em key={i} className="hl">{part.slice(1, -1)}</em>
        ) : (
          part
        ),
      )}
    </>
  )
}
