import { z } from "zod"
import { i18nField, i18nFieldOptional } from "./i18n-field"

/** 묶음 (자기소개 PPT 「技術スキル」와 같은 순서). 사이트 「技術」 칸이 이 순서로 나옴. */
export const skillCategory = z.enum(["frontend", "backend", "database", "ai", "infra", "other", "tools"])
export type SkillCategory = z.infer<typeof skillCategory>

/** 묶음 이름 (ko = 어드민·한국어 사이트, ja = 일본어 사이트) · 묶음 아래 작은 글씨 */
export const SKILL_CATEGORY: Record<SkillCategory, { ko: string; ja: string; note?: { ko: string; ja: string } }> = {
  frontend: { ko: "Frontend", ja: "Frontend" },
  backend: { ko: "Backend", ja: "Backend" },
  database: { ko: "Database", ja: "Database" },
  ai: { ko: "AI / ML", ja: "AI / ML" },
  infra: { ko: "Infra / 운영", ja: "Infra / 運用" },
  other: { ko: "기타", ja: "その他", note: { ko: "하드웨어 쪽 개발에서 출발", ja: "ハードウェア寄りの開発から出発" } },
  tools: { ko: "협업 도구", ja: "協働ツール" },
}

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
