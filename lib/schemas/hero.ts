import { z } from "zod"
import { i18nField, i18nFieldOptional, imageRef } from "./i18n-field"

/**
 * Hero 단일 도큐먼트 — Hero 섹션 + 우상단 메타 영역 + 푸터 컨택까지 커버.
 */
export const heroInput = z.object({
  name: i18nField,                 // KR=신지원, JP=シン・ジウォン, EN=Shin Jiwon
  tagline: i18nField,              // 한 줄 명함
  metaLeft: i18nFieldOptional,     // "포트폴리오 · 2026 · 개발자"
  location: i18nFieldOptional,     // "서울"
  focus: i18nFieldOptional,        // "AI × 풀스택"
  status: i18nFieldOptional,       // "구직 중"
  github: z.string().url().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  emailSecondary: z.string().email().optional().or(z.literal("")),
  portrait: imageRef.optional().nullable(),
  marqueeItems: z
    .array(z.string().trim().min(1))
    .min(6, "회전 배너는 최소 6개 이상 필요합니다")
    .max(20)
    .optional(),
})

export type HeroInput = z.infer<typeof heroInput>

export const hero = heroInput.extend({
  _id: z.string(),
  updatedAt: z.date(),
})

export type Hero = z.infer<typeof hero>
