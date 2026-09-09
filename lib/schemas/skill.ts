import { z } from "zod"
import { i18nField, i18nFieldOptional } from "./i18n-field"

export const skillCategory = z.enum(["main", "usable"])
export type SkillCategory = z.infer<typeof skillCategory>

export const skillInput = z.object({
  order: z.number().int().nonnegative().default(0),
  category: skillCategory,
  name: i18nField,                 // 기술명 다국어 (ko 필수, 영문명은 ko=ja 동일. 예: ja "Arduino / 組み込み")
  level: i18nFieldOptional,        // "능숙" "실무" "진행" 등 표시 라벨
  published: z.boolean().default(true),
})

export type SkillInput = z.infer<typeof skillInput>

export const skill = skillInput.extend({
  _id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Skill = z.infer<typeof skill>
