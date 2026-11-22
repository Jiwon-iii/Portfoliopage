import { cache } from "react"
import { listWorks } from "@/lib/repo/works"
import { listEducation } from "@/lib/repo/education"
import { listExperience } from "@/lib/repo/experience"
import { listSkills } from "@/lib/repo/skills"
import { listExpertise } from "@/lib/repo/expertise"
import { listPrinciples } from "@/lib/repo/principles"
import { getHero } from "@/lib/repo/hero"
import { getAbout } from "@/lib/repo/about"
import { label, pickLang, type Lang } from "@/lib/i18n"
import type { ImageRef, I18nFieldOptional } from "@/lib/schemas/i18n-field"
import type { Work } from "@/lib/schemas/work"
import type { Expertise } from "@/lib/schemas/expertise"
import type { Principle } from "@/lib/schemas/principle"
import { SKILL_CATEGORY, skillCategory, type Skill } from "@/lib/schemas/skill"

/**
 * 공개 사이트 전체 데이터. 요청 한 번에 한 번만 읽음 (React cache).
 * DB 연결 실패 시 빈 값 — 페이지는 빈 상태로 그려진다.
 */
export const loadSite = cache(async () => {
  try {
    const [works, education, experience, skills, expertise, principles, hero, about] = await Promise.all([
      listWorks(),
      listEducation(),
      listExperience(),
      listSkills(),
      listExpertise(false),
      listPrinciples(false),
      getHero(),
      getAbout(),
    ])
    return {
      works: works.filter((w) => w.type === "general"),
      education,
      experience,
      skills,
      // 어드민에 아직 없으면 확정 시안 문구로 채움 (입력하는 순간 DB 값으로 바뀜)
      // 어드민에 하나라도 있으면(숨김 포함) 그 값만, 아예 없을 때만 대체 문구
      expertise: expertise.length ? expertise.filter((x) => x.published) : FALLBACK_EXPERTISE,
      principles: principles.length ? principles.filter((x) => x.published) : FALLBACK_PRINCIPLES,
      hero,
      about,
    }
  } catch (err) {
    console.error("[site] DB 연결 실패:", err)
    return {
      works: [] as Work[],
      education: [],
      experience: [],
      skills: [] as Skill[],
      expertise: FALLBACK_EXPERTISE,
      principles: FALLBACK_PRINCIPLES,
      hero: null,
      about: null,
    }
  }
})

export type SiteData = Awaited<ReturnType<typeof loadSite>>

const t = (ko: string, ja: string): I18nFieldOptional & { ko: string } => ({ ko, ja })
const placeholderMeta = { _id: "", published: true, createdAt: new Date(0), updatedAt: new Date(0) }

const FALLBACK_EXPERTISE: Expertise[] = [
  {
    ...placeholderMeta, _id: "fallback-web", order: 0,
    // Web 분야 대표 사진 = 투사(도장 관리 SaaS) 운영 대시보드. 어드민에 분야를 등록하면 거기서 고른 사진이 대신 쓰임
    image: { url: "https://nv0xa5ktlyja0urf.public.blob.vercel-storage.com/portfolio/1793895794831-dashboard-yEinD9QOkVF7mKRcZclpM6mbd8FZkR.jpg", alt: "道場管理SaaS 運営ダッシュボード" }, relatedWorkIds: [], navLabel: "Web",
    title: t("웹 서비스 개발", "Webサービス開発"),
    description: t(
      "사용자 화면부터 관리자 화면까지 Next.js와 TypeScript로 만들어 왔습니다. 신청·랭킹·대시보드처럼 업무에서 매일 쓰이는 화면이 강점입니다.",
      "利用者画面から管理画面まで、Next.jsとTypeScriptで作ってきました。申込・ランキング・ダッシュボードなど、業務で毎日使われる画面が得意です。",
    ),
    tags: ["Next.js", "TypeScript", "React", "MongoDB", "Supabase"],
  },
  {
    ...placeholderMeta, _id: "fallback-ai", order: 1, image: null, relatedWorkIds: [], navLabel: "AI",
    title: t("AI·추천 시스템 개발", "AI・推薦システム開発"),
    description: t(
      "위치·인기·취향 유사도로 상품을 고르는 추천, LightGBM 랭킹 학습, 음성·손글씨(OCR) 상품 등록을 운영 중인 서비스에 붙여 왔습니다.",
      "位置・人気・好みの近さで商品を並べる推薦、LightGBMによるランキング学習、音声や手書き（OCR）での商品登録を、運用中のサービスに組み込んできました。",
    ),
    tags: ["Python", "FastAPI", "LightGBM", "Whisper", "OCR"],
  },
  {
    ...placeholderMeta, _id: "fallback-server", order: 2,
    // Server 분야 대표 사진 = AIsports 대회 현장 (Java 백엔드 데이터 흐름 정리한 프로젝트)
    image: { url: "https://nv0xa5ktlyja0urf.public.blob.vercel-storage.com/portfolio/1780044550821-__2-WFA6BVO02NyhicmUBcs4YPu8ALAEOc.jpg", alt: "AIsports 縄跳び大会の会場" }, relatedWorkIds: [], navLabel: "Server",
    title: t("서버·API 개발", "サーバー・API開発"),
    description: t(
      "AI 서버를 FastAPI로 분리하고 Java 백엔드의 데이터 처리 흐름을 정리하는 등, 서비스를 받치는 서버와 API를 만들어 왔습니다.",
      "AIサーバーをFastAPIで分離し、Javaバックエンドのデータ処理の流れを整理するなど、サービスを支えるサーバーとAPIを作ってきました。",
    ),
    tags: ["FastAPI", "Java", "Next.js API Routes", "MongoDB", "MySQL"],
  },
]

const FALLBACK_PRINCIPLES: Principle[] = [
  {
    ...placeholderMeta, _id: "fallback-1", order: 0,
    title: t("실제로 쓰이는지 확인하기", "使われているかを確かめる"),
    body: t(
      "추천 결과가 클릭·구매로 이어졌는지 기록하고, 매일 밤 AI와 일반 알고리즘을 같은 기준으로 비교합니다. 정확도가 낮으면 다음 날 자동으로 알고리즘으로 바뀝니다.",
      "推薦結果がクリック・購入されたかを記録し、毎晩AIと通常のアルゴリズムを同じ基準で比べています。精度が低ければ、翌日は自動でアルゴリズムに切り替わります。",
    ),
  },
  {
    ...placeholderMeta, _id: "fallback-2", order: 1,
    title: t("운영 중인 서비스는 멈추지 않기", "動いているサービスを止めない"),
    body: t(
      "AI 서버를 FastAPI로 분리하고 쇼핑몰 DB는 읽기만 하게 했습니다. 운영 중인 서비스에 영향을 주지 않고 새 기능을 더할 수 있습니다.",
      "AIサーバーをFastAPIで分離し、ECのデータベースは読むだけにしました。運用中のサービスへの影響を抑えたまま、新しい機能を足せます。",
    ),
  },
  {
    ...placeholderMeta, _id: "fallback-3", order: 2,
    title: t("원인을 하나씩 좁혀 가기", "原因を一つずつ切り分ける"),
    body: t(
      "오류율 100%였던 음성 인식을, 모델이 아니라 실행 환경(fp16) 문제로 짚어 내고 fp32로 고정해 해결했습니다.",
      "誤り率100%だった音声認識を、モデルではなく実行環境（fp16）の問題だと突き止め、fp32に固定して解決しました。",
    ),
  },
]

// ponytail: 관련 실적을 어드민에서 아직 안 골랐을 때만 기술 태그로 추정. 분야가 늘어나면 어드민에서 직접 고르는 게 정답.
const AREA_GUESS: Record<string, RegExp> = {
  web: /\b(web|next\.js|react|pwa)\b/i,
  ai: /\b(ai|ml|llm)\b|추천|推薦/i,
  server: /\b(server|backend|java|spring|fastapi|go|gin)\b/i,
}

/** 분야에 속한 프로젝트(works). 어드민에서 고른 관련 실적 → 없으면 메뉴 이름으로 기술 태그 추정. */
export function areaWorks(item: Expertise, works: Work[]): Work[] {
  if (item.relatedWorkIds.length) return works.filter((w) => item.relatedWorkIds.includes(w._id))
  const guess = AREA_GUESS[(item.navLabel ?? "").toLowerCase()]
  return guess ? works.filter((w) => w.techs.some((t) => guess.test(t))) : []
}

/** 分野 카드 사진: 직접 올린 사진 → 관련 실적 첫 사진 → 같은 순번 실적 사진. */
export function expertiseImage(item: Expertise, works: Work[], index: number): ImageRef | null {
  if (item.image) return item.image
  const related = areaWorks(item, works).find((w) => w.images.length)
  return related?.images[0] ?? works.filter((w) => w.images.length)[index]?.images[0] ?? null
}

export type HistoryItem = { date: string; title: string; sub: string }

// ponytail: 자격증은 몇 년에 한 번 바뀌어서 코드에 둠 (자기소개 PPT 「資格・語学」와 같은 내용). 자주 바뀌면 어드민 컬렉션으로.
const CERTIFICATIONS: { date: string; name: ReturnType<typeof t>; kind: ReturnType<typeof t> }[] = [
  { date: "2017–2019", name: t("ITQ 5과목 모두 A등급 (한국)", "ITQ 5科目すべてA級（韓国）"), kind: t("정보기술", "情報技術") },
  { date: "2018.10", name: t("컴퓨터활용능력 2급 (한국)", "コンピュータ活用能力 2級（韓国）"), kind: t("PC 활용", "PC活用") },
  { date: "2019.01", name: t("워드프로세서 1급 (한국)", "ワードプロセッサ 1級（韓国）"), kind: t("문서 작성", "文書作成") },
  { date: "2019.09", name: t("GTQ 1급 (한국)", "GTQ 1級（韓国）"), kind: t("그래픽", "グラフィック") },
  { date: "2021.09", name: t("1종 보통 운전면허 (한국)", "第一種普通自動車免許（韓国）"), kind: t("운전", "運転") },
  { date: "2026.08", name: t("일본어능력시험(JLPT) N2", "日本語能力試験（JLPT）N2"), kind: t("어학", "語学") },
]

/** 技術 — 어드민 「기술」을 묶음(Frontend · Backend · …) 순서로. 빈 묶음은 뺌. */
export function skillGroups(skills: Skill[], lang: Lang) {
  return skillCategory.options
    .map((c) => ({
      label: pickLang(SKILL_CATEGORY[c], lang),
      items: skills.filter((s) => s.category === c).map((s) => pickLang(s.name, lang)),
      note: pickLang(SKILL_CATEGORY[c].note, lang),
    }))
    .filter((g) => g.items.length)
}

/** 資格・免許 — 沿革처럼 오래된 것부터. */
export function certItems(lang: Lang): HistoryItem[] {
  return CERTIFICATIONS.map((c) => ({ date: c.date, title: pickLang(c.name, lang), sub: pickLang(c.kind, lang) }))
}

/** 沿革 = 학력 + 경력을 시작일 순으로. 날짜는 "2022.03" 같은 자유 형식이라 문자열 비교. */
export function historyItems(data: SiteData, lang: Lang): HistoryItem[] {
  const range = (p: { start: string; end: string }) => (p.end && p.end !== p.start ? `〜${p.end}` : "")
  const items: HistoryItem[] = [
    ...data.education.map((e) => ({
      date: e.period.start,
      title: pickLang(e.schoolName, lang),
      sub: [pickLang(e.major, lang), range(e.period)].filter(Boolean).join(" "),
    })),
    ...data.experience.map((e) => ({
      date: e.period.start,
      title: pickLang(e.title, lang),
      sub: [pickLang(e.orgName, lang), range(e.period)].filter(Boolean).join(" "),
    })),
  ]
  return items.sort((a, b) => a.date.localeCompare(b.date))
}

const ONGOING = /현재|現在|present|now/i

/** 概要 표 — 이미 있는 데이터(대표 소개·학력·경력·専門分野·기술)에서 뽑음. 빈 칸은 행 자체를 뺌. */
export function overviewRows(data: SiteData, lang: Lang): [string, string][] {
  const L = (k: Parameters<typeof label>[0]) => label(k, lang)
  const h = data.hero
  const name = pickLang(h?.name, lang)
  const enName = h?.name?.en && lang !== "en" ? `（${h.name.en}）` : ""
  const edu = data.education[0]
  const current = data.experience.find((e) => ONGOING.test(e.period.end))
  const rows: [string, string][] = [
    [L("ovName"), name ? name + enName : ""],
    [L("ovRole"), L("role")],
    [L("ovLocation"), pickLang(h?.location, lang)],
    [L("sectionEducation"), edu ? [pickLang(edu.schoolName, lang), pickLang(edu.major, lang), edu.period.end].filter(Boolean).join(" ／ ") : ""],
    [L("ovAffiliation"), current ? [pickLang(current.title, lang), pickLang(current.orgName, lang)].filter(Boolean).join(" ／ ") : ""],
    [L("ovAreas"), data.expertise.map((x) => pickLang(x.title, lang)).join("／")],
    [L("ovSkills"), "TypeScript・React・Next.js ／ Go・Java・Python ／ MySQL・PostgreSQL・MongoDB ／ AWS・Docker・GitHub Actions"],
    [L("ovContact"), h?.email ?? ""],
  ]
  return rows.filter(([, v]) => v)
}
