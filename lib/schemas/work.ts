import { z } from "zod"
import { i18nField, i18nFieldOptional, imageRef } from "./i18n-field"

/**
 * Works 컬렉션 — Featured / Other Works / Currently Building 모두 여기.
 * type 필드로 구분.
 */
export const workType = z.enum(["featured", "other", "practice", "building"])
export type WorkType = z.infer<typeof workType>

/**
 * 작품 입력용 스키마 (생성 / 수정 시 사용 — _id, timestamps 제외).
 */
export const workInput = z.object({
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "소문자·숫자·하이픈만"),
  type: workType,
  order: z.number().int().nonnegative().default(0),

  title: i18nField,
  tagline: i18nFieldOptional,
  description: i18nFieldOptional, // 마크다운

  // Featured 전용 (PROBLEM / APPROACH / OUTCOME)
  problem: i18nFieldOptional.optional(),
  approach: i18nFieldOptional.optional(),
  outcome: i18nFieldOptional.optional(),

  techs: z.array(z.string()).default([]),
  year: z.number().int().min(2000).max(2100).optional(),

  githubUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),

  images: z.array(imageRef).default([]),

  published: z.boolean().default(true),
})

export type WorkInput = z.infer<typeof workInput>

/**
 * DB에서 읽어올 때 사용. _id 와 timestamps 포함.
 */
export const work = workInput.extend({
  _id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Work = z.infer<typeof work>
