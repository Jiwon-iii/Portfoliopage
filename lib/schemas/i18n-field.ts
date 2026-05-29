import { z } from "zod"

export type Lang = "ko" | "ja" | "en"
export const LANGS = ["ko", "ja", "en"] as const

/**
 * 다국어 필드. KR 필수, JP/EN 선택 (V1=KR only, V1.5=JP/EN).
 */
export const i18nField = z.object({
  ko: z.string().min(1, "한국어 콘텐츠는 필수입니다"),
  ja: z.string().optional().nullable(),
  en: z.string().optional().nullable(),
})

export type I18nField = z.infer<typeof i18nField>

/**
 * 다국어 필드 (KR도 선택). 자기소개 부가 문장 등에 사용.
 */
export const i18nFieldOptional = z.object({
  ko: z.string().optional().nullable(),
  ja: z.string().optional().nullable(),
  en: z.string().optional().nullable(),
})

export type I18nFieldOptional = z.infer<typeof i18nFieldOptional>

/**
 * 언어 선택 + 폴백.
 * 1순위: 요청한 언어. 2순위: KR. 3순위: 빈 문자열.
 */
export function pickLang(field: I18nField | I18nFieldOptional | null | undefined, lang: Lang): string {
  if (!field) return ""
  const value = field[lang]
  if (value) return value
  return field.ko ?? ""
}

/**
 * 이미지 참조 (Vercel Blob URL + alt).
 */
export const imageRef = z.object({
  url: z.string().url(),
  alt: z.string().optional().nullable(),
})

export type ImageRef = z.infer<typeof imageRef>
