import { z } from "zod"
import { i18nField, i18nFieldOptional, imageRef } from "./i18n-field"

/**
 * About 단일 도큐먼트 — 자기소개 섹션.
 */
export const aboutInput = z.object({
  heading: i18nField,                                    // 큰 인용문
  paragraphs: z.array(i18nFieldOptional).default([]),    // 본문 단락
  images: z.array(imageRef).default([]),                 // 자기소개용 사진 (여러 장, 슬라이더)
})

export type AboutInput = z.infer<typeof aboutInput>

export const about = aboutInput.extend({
  _id: z.string(),
  updatedAt: z.date(),
})

export type About = z.infer<typeof about>
