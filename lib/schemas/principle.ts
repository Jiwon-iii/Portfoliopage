import { z } from "zod"
import { i18nField, i18nFieldOptional } from "./i18n-field"

/**
 * 大切にしていること — 일하는 방식·가치 1개 (제목 + 실제 경험 한두 문장).
 */
export const principleInput = z.object({
  order: z.number().int().nonnegative().default(0),
  title: i18nField,
  body: i18nFieldOptional,
  published: z.boolean().default(true),
})

export type PrincipleInput = z.infer<typeof principleInput>

export const principle = principleInput.extend({
  _id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Principle = z.infer<typeof principle>
