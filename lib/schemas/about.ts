import { z } from "zod"
import { i18nField, i18nFieldOptional } from "./i18n-field"

/**
 * About 단일 도큐먼트 — 자기소개 섹션.
 */
export const aboutInput = z.object({
  heading: i18nField,                          // 큰 인용문 ("웹을 만들면서 AI를 박아넣는...")
  paragraphs: z.array(i18nFieldOptional).default([]),  // 본문 단락들
  caption: i18nFieldOptional,                  // 포트레이트 캡션
})

export type AboutInput = z.infer<typeof aboutInput>

export const about = aboutInput.extend({
  _id: z.string(),
  updatedAt: z.date(),
})

export type About = z.infer<typeof about>
