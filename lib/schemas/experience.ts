import { z } from "zod"
import { i18nField, i18nFieldOptional } from "./i18n-field"

export const experienceInput = z.object({
  order: z.number().int().nonnegative().default(0),
  title: i18nField,                    // 역할명 ("AI 심판 시스템 - 랭킹/매니저 담당")
  orgName: i18nFieldOptional,          // 회사·동아리·기관명
  period: z.object({
    start: z.string().min(1),
    end: z.string().min(1),
  }),
  techs: z.array(z.string()).default([]),
  description: i18nFieldOptional,
  published: z.boolean().default(true),
})

export type ExperienceInput = z.infer<typeof experienceInput>

export const experience = experienceInput.extend({
  _id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Experience = z.infer<typeof experience>
