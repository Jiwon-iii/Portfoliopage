import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "신지원 / Shin Jiwon — Portfolio"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          background: "#F4F4F5",
          color: "#18181B",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, color: "#71717A", letterSpacing: 4 }}>
          <span>PORTFOLIO · 2026</span>
          <span>SHIN JIWON</span>
        </div>

        <div>
          <div style={{ fontSize: 220, fontWeight: 900, letterSpacing: -10, lineHeight: 0.9 }}>신지원</div>
          <div style={{ fontSize: 36, fontStyle: "italic", color: "#71717A", marginTop: 8 }}>Shin Jiwon, dev.</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#18181B", lineHeight: 1.3 }}>
            Next.js로 풀스택 웹을 만들고,
            <br />
            거기에 <span style={{ color: "#6366F1", fontStyle: "italic" }}>AI</span>를 자연스럽게 녹여내는 개발자.
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 16, color: "#6366F1", marginTop: 16, alignItems: "center" }}>
            <span style={{ width: 10, height: 10, background: "#6366F1", borderRadius: 999 }} />
            <span style={{ letterSpacing: 4 }}>OPEN TO WORK · 구직 중</span>
          </div>
        </div>
      </div>
    ),
    size,
  )
}
