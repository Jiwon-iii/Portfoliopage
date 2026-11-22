import { z } from "zod"
import { i18nField, i18nFieldOptional, imageRef } from "./i18n-field"

/**
 * 分野 — 「Webサービス開発」「AI・推薦システム」처럼 맡아 온 분야 1개.
 * relatedWorkIds 로 그 분야의 실적(works)을 묶고, navLabel(Web · AI · Server)은 위쪽 메뉴 드롭다운에 쓰임.
 */
export const expertiseInput = z.object({
  order: z.number().int().nonnegative().default(0),
  title: i18nField,
  navLabel: z.string().trim().max(20).optional(), // 메뉴 드롭다운용 짧은 이름. 비우면 제목
  description: i18nFieldOptional,
  tags: z.array(z.string().trim().min(1)).default([]),
  image: imageRef.optional().nullable(),
  relatedWorkIds: z.array(z.string()).default([]),
  published: z.boolean().default(true),
})

export type ExpertiseInput = z.infer<typeof expertiseInput>

export const expertise = expertiseInput.extend({
  _id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Expertise = z.infer<typeof expertise>
