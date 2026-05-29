import { z } from "zod"
import { i18nField, i18nFieldOptional, LANGS } from "./i18n-field"

/**
 * 사이트 설정 단일 도큐먼트.
 */
export const settingsInput = z.object({
  siteName: i18nField,
  metaDescription: i18nFieldOptional,
  metaKeywords: z.array(z.string()).default([]),
  enabledLanguages: z.array(z.enum(LANGS)).default(["ko"]),  // V1=ko만
  defaultLanguage: z.enum(LANGS).default("ko"),
  ogImageUrl: z.string().url().optional().or(z.literal("")),
})

export type SettingsInput = z.infer<typeof settingsInput>

export const settings = settingsInput.extend({
  _id: z.string(),
  updatedAt: z.date(),
})

export type Settings = z.infer<typeof settings>
