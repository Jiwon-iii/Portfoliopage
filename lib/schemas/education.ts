import { z } from "zod"
import { i18nField, i18nFieldOptional } from "./i18n-field"

export const educationInput = z.object({
  order: z.number().int().nonnegative().default(0),
  schoolName: i18nField,
  major: i18nFieldOptional,
  period: z.object({
    start: z.string().min(1), // "2023-03" 또는 "2023" 같은 자유 형식
    end: z.string().min(1),   // "현재" 또는 "2025-02" 등
  }),
  note: i18nFieldOptional,
  published: z.boolean().default(true),
})

export type EducationInput = z.infer<typeof educationInput>

export const education = educationInput.extend({
  _id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Education = z.infer<typeof education>
