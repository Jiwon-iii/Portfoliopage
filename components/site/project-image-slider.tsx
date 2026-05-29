"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { ImageRef } from "@/lib/schemas/i18n-field"

/**
 * 프로젝트 이미지 슬라이더.
 * - 단일: 단순 표시
 * - 복수: 스크롤 스냅으로 좌우 드래그/스와이프, 도트 + 데스크톱 화살표
 * - 컨테이너 비율: ratio prop 으로 통일 (전 프로젝트 동일 크기)
 * - 이미지: object-contain — 잘리지 않고 자연 비율 유지, 남는 공간은 배경
 */
export function ProjectImageSlider({
  images,
  alt,
  ratio = "16 / 9",
  sizes,
  className,
  imageClassName,
}: {
  images: ImageRef[]
  alt: string
  /** 컨테이너 가로/세로 비율. 모든 프로젝트가 동일 비율로 통일됨. */
  ratio?: string
  sizes?: string
  className?: string
  imageClassName?: string
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const count = images.length
  const aspectRatio = ratio
  const first = images[0]

  // 슬라이드 트래킹 — IntersectionObserver 로 현재 보이는 슬라이드 감지
  useEffect(() => {
    if (count <= 1) return
    const track = trackRef.current
    if (!track) return
    const slides = Array.from(track.querySelectorAll<HTMLElement>("[data-slide]"))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const idx = Number(entry.target.getAttribute("data-slide"))
            setActive(idx)
          }
        })
      },
      { root: track, threshold: [0, 0.6, 1] },
    )
    slides.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [count])

  function scrollTo(idx: number) {
    const track = trackRef.current
    if (!track) return
    const slide = track.querySelector<HTMLElement>(`[data-slide="${idx}"]`)
    slide?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" })
  }

  if (count === 0) {
    return (
      <div
        className={`relative bg-secondary border border-border rounded-md overflow-hidden ${className ?? ""}`}
        style={{ aspectRatio }}
      >
        <div className="absolute inset-0 grid place-items-center text-muted-foreground font-mono text-xs tracking-wider">
          SCREENSHOT
        </div>
      </div>
    )
  }

  if (count === 1) {
    return (
      <div
        className={`relative overflow-hidden rounded-md border border-border bg-secondary ${className ?? ""}`}
        style={{ aspectRatio }}
      >
        <Image
          src={first.url}
          alt={first.alt || alt}
          fill
          className={`object-contain ${imageClassName ?? ""}`}
          sizes={sizes}
        />
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-hidden rounded-md border border-border bg-secondary group ${className ?? ""}`}
      style={{ aspectRatio }}
    >
      <div
        ref={trackRef}
        className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        {images.map((img, i) => (
          <div
            key={img.url}
            data-slide={i}
            className="relative flex-shrink-0 w-full h-full snap-center"
          >
            <Image
              src={img.url}
              alt={img.alt || `${alt} ${i + 1}`}
              fill
              className={`object-contain ${imageClassName ?? ""}`}
              sizes={sizes}
            />
          </div>
        ))}
      </div>

      {/* 데스크톱 화살표 — 항상 살짝 보이고 hover 시 진해짐 */}
      <button
        type="button"
        onClick={() => scrollTo(Math.max(0, active - 1))}
        disabled={active === 0}
        aria-label="이전 이미지"
        className="hidden md:grid absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 place-items-center rounded-full bg-zinc-900/70 hover:bg-zinc-900 text-white shadow-lg ring-1 ring-white/10 backdrop-blur-md opacity-70 group-hover:opacity-100 hover:scale-105 transition-all disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
      </button>
      <button
        type="button"
        onClick={() => scrollTo(Math.min(count - 1, active + 1))}
        disabled={active === count - 1}
        aria-label="다음 이미지"
        className="hidden md:grid absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 place-items-center rounded-full bg-zinc-900/70 hover:bg-zinc-900 text-white shadow-lg ring-1 ring-white/10 backdrop-blur-md opacity-70 group-hover:opacity-100 hover:scale-105 transition-all disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <ChevronRight className="h-5 w-5 stroke-[2.5]" />
      </button>

      {/* 도트 + 카운터 */}
      <div className="absolute bottom-2.5 left-0 right-0 flex justify-center items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 bg-background/85 backdrop-blur rounded-full px-3 py-1.5 pointer-events-auto">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`${i + 1}번째 이미지로 이동`}
              className={
                "rounded-full transition-all " +
                (i === active
                  ? "w-4 h-1.5 bg-foreground"
                  : "w-1.5 h-1.5 bg-foreground/40 hover:bg-foreground/70")
              }
            />
          ))}
          <span className="ml-1 font-mono text-[10px] tracking-wider text-muted-foreground">
            {active + 1}/{count}
          </span>
        </div>
      </div>
    </div>
  )
}
