import { z } from "zod"
import { i18nField, i18nFieldOptional, imageRef } from "./i18n-field"

/**
 * Works 컬렉션 — 일반 프로젝트 / 연습.
 *
 * 레거시 type 값 ("featured" | "other" | "building") 은 자동 마이그레이션:
 *  - "featured" / "other"  → "general"
 *  - "building"            → "general" + status="in-progress"
 */
export const workType = z.enum(["general", "practice"])
export type WorkType = z.infer<typeof workType>

export const workStatus = z.enum(["in-progress", "completed"])
export type WorkStatus = z.infer<typeof workStatus>

const baseShape = z.object({
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "소문자·숫자·하이픈만"),
  type: workType,
  status: workStatus.default("completed"),
  order: z.number().int().nonnegative().default(0),

  title: i18nField,
  tagline: i18nFieldOptional,
  description: i18nFieldOptional, // 마크다운

  // 케이스 스터디 (옵션)
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

/**
 * 입력 raw → 레거시 type 값을 신규 type + status 로 변환.
 * (z.preprocess 로 감싸면 .partial() 같은 ZodObject 메서드가 막혀서, 함수로 따로 빼고 두 스키마에 각각 적용.)
 */
function migrateLegacy(raw: unknown): unknown {
  if (typeof raw !== "object" || raw === null) return raw
  const r = { ...(raw as Record<string, unknown>) }
  const legacy = r.type
  if (legacy === "featured" || legacy === "other") {
    r.type = "general"
    if (!r.status) r.status = "completed"
  } else if (legacy === "building") {
    r.type = "general"
    if (!r.status) r.status = "in-progress"
  }
  return r
}

export const workInput = z.preprocess(migrateLegacy, baseShape)

/** PATCH 용 — 모든 필드 optional, 레거시 변환은 동일하게 적용. */
export const workUpdate = z.preprocess(migrateLegacy, baseShape.partial())

export type WorkInput = z.infer<typeof workInput>

/**
 * DB에서 읽어올 때 사용. _id 와 timestamps 포함.
 */
export const work = baseShape.extend({
  _id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Work = z.infer<typeof work>
