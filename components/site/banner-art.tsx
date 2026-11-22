"use client"

import { useEffect, useRef } from "react"

/**
 * 하위 페이지 머리 배너에 까는 움직이는 그림 (PageHead 의 art).
 * 바탕은 다른 페이지 머리와 같은 .pt 색, 선·점은 테라코타, 이름표는 먹색.
 * 넓은 화면은 왼쪽(글자 자리)을 비우고, 좁은 화면은 이름표 없이 옅은 무늬만.
 */
const POINT = "#a85d44"
const INK = "#111"
const TAU = Math.PI * 2
const NARROW = 860

type Pt = { x: number; y: number }
type Frame = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void
/** data(문자열) 로 한 장면을 만듦. 모듈 함수라 참조가 바뀌지 않음 */
type Scene = (data: string, font: string) => Frame | null

const fadeX = (x: number, w: number) => (w < NARROW ? 0.35 : Math.min(1, Math.max(0, (x / w - 0.3) / 0.3)) ** 1.4)

function seeded(seed: number) {
  return () => (seed = (seed * 16807) % 2147483647) / 2147483647
}

function pill(ctx: CanvasRenderingContext2D, x: number, y: number, label: string, font: string, bg: string) {
  ctx.font = `700 12px ${font}`
  ctx.letterSpacing = "1.5px"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  const tw = ctx.measureText(label).width + 22
  ctx.globalAlpha = 1
  ctx.fillStyle = bg
  ctx.beginPath()
  ctx.roundRect(x - tw / 2, y - 13, tw, 26, 13)
  ctx.fill()
  ctx.fillStyle = "#fff"
  ctx.fillText(label, x, y + 0.5)
}

/** 캔버스 크기 맞춤 · 매 프레임 그리기. 움직임 줄이기 설정이면 한 장만 그림 */
function useBannerCanvas(data: string, scene: Scene) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    const draw = scene(data, getComputedStyle(canvas).fontFamily)
    if (!draw) return
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches
    let w = 0
    let h = 0
    let raf = 0
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = r.width
      h = r.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (still) draw(ctx, w, h, 1.2)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()
    const loop = (ms: number) => {
      draw(ctx, w, h, ms / 1000)
      raf = requestAnimationFrame(loop)
    }
    if (!still) raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [data, scene])
  return ref
}

// ─────────────────────────────────────────────
// 分野: 작은 점들이 분야(Web · AI · Server) 중심 주위를 돌며 선으로 이어짐
// ─────────────────────────────────────────────
const HUBS = [{ x: 0.6, y: 0.34 }, { x: 0.86, y: 0.3 }, { x: 0.74, y: 0.74 }] // 앞의 3개까지

const areaScene: Scene = (data, font) => {
  const names = data ? data.split("\n").slice(0, HUBS.length) : []
  if (!names.length) return null
  const rnd = seeded(7)
  const parts = Array.from({ length: 30 * names.length }, (_, i) => ({
    hub: i % names.length, a: rnd() * TAU, r: 34 + rnd() * 120,
    sp: (0.12 + rnd() * 0.28) * (rnd() < 0.5 ? -1 : 1), wob: rnd() * TAU, s: 0.8 + rnd() * 1.8,
  }))
  return (ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h)
    const hubs = names.map((_, i) => ({ x: HUBS[i].x * w + Math.sin(t * 0.4 + i) * 6, y: HUBS[i].y * h + Math.cos(t * 0.5 + i) * 5 }))
    const pts = parts.map((p) => {
      const hb = hubs[p.hub]
      const a = p.a + t * p.sp
      const r = p.r + Math.sin(t * 0.8 + p.wob) * 10
      return { x: hb.x + Math.cos(a) * r * 1.25, y: hb.y + Math.sin(a) * r * 0.8, hub: p.hub, s: p.s }
    })
    ctx.lineWidth = 1
    ctx.strokeStyle = POINT
    ctx.fillStyle = POINT
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i]
      const f = fadeX(p.x, w)
      if (f <= 0) continue
      const hb = hubs[p.hub]
      ctx.globalAlpha = 0.15 * f
      ctx.beginPath()
      ctx.moveTo(p.x, p.y)
      ctx.lineTo(hb.x, hb.y)
      ctx.stroke()
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j]
        const d = Math.hypot(p.x - q.x, p.y - q.y)
        if (d >= 70) continue
        ctx.globalAlpha = (1 - d / 70) * 0.5 * f
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(q.x, q.y)
        ctx.stroke()
      }
    }
    // 분야 중심끼리 점선
    ctx.setLineDash([4, 6])
    ctx.globalAlpha = 0.4 * (w < NARROW ? 0.35 : 1)
    ctx.beginPath()
    hubs.forEach((hb, i) => (i ? ctx.lineTo(hb.x, hb.y) : ctx.moveTo(hb.x, hb.y)))
    ctx.closePath()
    ctx.stroke()
    ctx.setLineDash([])
    for (const p of pts) {
      ctx.globalAlpha = 0.85 * fadeX(p.x, w)
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.s, 0, TAU)
      ctx.fill()
    }
    if (w < NARROW) return
    hubs.forEach((hb, i) => {
      ctx.fillStyle = POINT
      ctx.globalAlpha = 0.2
      ctx.beginPath()
      ctx.arc(hb.x, hb.y, 34 + Math.sin(t * 1.5 + i) * 4, 0, TAU)
      ctx.fill()
      pill(ctx, hb.x, hb.y, names[i].toUpperCase(), font, INK)
    })
  }
}

export function AreaArt({ labels }: { labels: string[] }) {
  return <canvas ref={useBannerCanvas(labels.join("\n"), areaScene)} className="pt-art" aria-hidden="true" />
}

// ─────────────────────────────────────────────
// 概要・沿革: 깃 브랜치 그래프처럼 연도 마디가 세 갈래를 오가며 NOW 까지 이어지고, 점들이 흐름
// ─────────────────────────────────────────────
const LANES = [0.3, 0.52, 0.74]

function bezier(a: Pt, b: Pt, u: number): Pt {
  // a → b 를 가로 S 곡선으로 (조절점은 가운데 x 에서 각 높이)
  const mx = (a.x + b.x) / 2
  const v = 1 - u
  return {
    x: v * v * v * a.x + 3 * v * v * u * mx + 3 * v * u * u * mx + u * u * u * b.x,
    y: v * v * v * a.y + 3 * v * v * u * a.y + 3 * v * u * u * b.y + u * u * u * b.y,
  }
}

const historyScene: Scene = (data, font) => {
  const marks = data ? data.split("\n") : []
  if (marks.length < 2) return null
  const laneOf = (i: number) => (i === marks.length - 1 ? 1 : [1, 2, 0][i % 3])
  const rnd = seeded(11)
  // lane -1 = 마디 길을 따라, 0~2 = 그 갈래를 곧게
  const parts = Array.from({ length: 34 }, () => ({ s: rnd(), sp: 0.025 + rnd() * 0.04, lane: rnd() < 0.4 ? Math.floor(rnd() * 3) : -1, r: 1 + rnd() * 1.5 }))
  return (ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h)
    const narrow = w < NARROW
    const x0 = w * (narrow ? 0.08 : 0.44)
    const x1 = w * 0.92
    const nodes = marks.map((_, i) => ({ x: x0 + ((x1 - x0) * i) / (marks.length - 1), y: h * LANES[laneOf(i)] }))
    const along = (s: number) => {
      const f = s * (nodes.length - 1)
      const i = Math.min(nodes.length - 2, Math.floor(f))
      return bezier(nodes[i], nodes[i + 1], f - i)
    }
    const dim = narrow ? 0.4 : 1
    ctx.strokeStyle = POINT
    ctx.fillStyle = POINT
    // 세 갈래 (옅은 점선)
    ctx.setLineDash([3, 7])
    ctx.lineWidth = 1
    for (const ly of LANES) {
      for (let x = x0 - 80; x < w; x += 40) {
        ctx.globalAlpha = 0.22 * fadeX(x, w) * dim
        ctx.beginPath()
        ctx.moveTo(x, h * ly)
        ctx.lineTo(x + 40, h * ly)
        ctx.stroke()
      }
    }
    ctx.setLineDash([])
    // 마디를 잇는 길
    ctx.lineWidth = 1.8
    ctx.globalAlpha = 0.55 * dim
    ctx.beginPath()
    nodes.forEach((n, i) => {
      if (!i) return ctx.moveTo(n.x, n.y)
      const p = nodes[i - 1]
      const mx = (p.x + n.x) / 2
      ctx.bezierCurveTo(mx, p.y, mx, n.y, n.x, n.y)
    })
    ctx.stroke()
    // 흐르는 점 (꼬리 포함)
    for (const p of parts) {
      const s = (p.s + t * p.sp) % 1
      for (let k = 0; k < 7; k++) {
        const sk = s - k * 0.005
        if (sk < 0) break
        const q = p.lane < 0 ? along(sk) : { x: x0 - 80 + (w - x0 + 80) * sk, y: h * LANES[p.lane] }
        ctx.globalAlpha = (1 - k / 7) * 0.85 * fadeX(q.x, w)
        ctx.beginPath()
        ctx.arc(q.x, q.y, p.r * (1 - k * 0.08), 0, TAU)
        ctx.fill()
      }
    }
    // 마디 + 연도 이름표
    nodes.forEach((n, i) => {
      const last = i === nodes.length - 1
      ctx.fillStyle = POINT
      ctx.globalAlpha = 0.18 * dim
      ctx.beginPath()
      ctx.arc(n.x, n.y, (last ? 20 : 13) + Math.sin(t * 1.6 + i) * 3, 0, TAU)
      ctx.fill()
      ctx.globalAlpha = dim
      ctx.beginPath()
      ctx.arc(n.x, n.y, last ? 7 : 5, 0, TAU)
      ctx.fill()
      ctx.fillStyle = "#fff"
      ctx.beginPath()
      ctx.arc(n.x, n.y, 2, 0, TAU)
      ctx.fill()
      if (!narrow) pill(ctx, n.x, n.y - 30, marks[i], font, last ? POINT : INK)
    })
  }
}

/** marks: 연도들 + 마지막 "NOW" */
export function HistoryArt({ marks }: { marks: string[] }) {
  return <canvas ref={useBannerCanvas(marks.join("\n"), historyScene)} className="pt-art" aria-hidden="true" />
}
