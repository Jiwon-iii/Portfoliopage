/**
 * 시드 스크립트 — 최초 콘텐츠 채우기.
 *
 * 사용법:
 *   .env.local 에 MONGODB_URI 설정 → npm run seed
 *
 * 멱등성: 같은 slug 가 있으면 덮어쓰지 않고 skip. (강제 재시드는 --force)
 */
import { config } from "dotenv"
import { MongoClient, ObjectId } from "mongodb"

config({ path: ".env.local" })

const FORCE = process.argv.includes("--force")

async function main() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error("✗ MONGODB_URI 환경변수가 없습니다. .env.local 확인.")
    process.exit(1)
  }

  const client = await new MongoClient(uri).connect()
  const db = client.db(process.env.MONGODB_DB ?? "portfolio")
  console.log("✓ MongoDB 연결됨\n")

  // ── Hero ────────────────────────────────────────
  const hero = {
    slug: "main",
    name: { ko: "신지원", ja: "シン・ジウォン", en: "Shin Jiwon" },
    tagline: { ko: "Next.js로 풀스택 웹을 만들면서 거기에 *AI*를 박아넣는 개발자." },
    metaLeft: { ko: "포트폴리오 · 2026 · 개발자" },
    location: { ko: "서울" },
    focus: { ko: "AI × 풀스택" },
    status: { ko: "구직 중" },
    github: "https://github.com/Jiwon-iii",
    email: "syrima03@gmail.com",
    emailSecondary: "syrima03@naver.com",
    portrait: null,
    updatedAt: new Date(),
  }
  await upsertSingleton(db, "hero", hero)

  // ── About ────────────────────────────────────────
  const about = {
    slug: "main",
    heading: { ko: "웹을 만들면서 *AI를 함께* 박아넣는 작업을 합니다." },
    paragraphs: [
      { ko: "Next.js로 풀스택 웹을 만들고, MongoDB로 데이터를 조작하고, 지금은 기계학습 공부와 AI 기능 통합에 집중하고 있습니다." },
      { ko: "기술 사이 경계를 넘는 호기심을 가지고 있습니다. 다음 자리에서 만들고 싶은 건 AI가 자연스럽게 박혀있는 웹 제품입니다." },
      { ko: "이 사이트 자체도 제가 만든 어드민으로 콘텐츠가 관리되는 풀스택 작품입니다. 그 자체가 작업물 중 하나입니다." },
    ],
    updatedAt: new Date(),
  }
  await upsertSingleton(db, "about", about)

  // ── Works ────────────────────────────────────────
  const works = [
    {
      slug: "aisports",
      type: "featured",
      order: 0,
      title: { ko: "AIsports 태권도 대회 시스템", ja: "", en: "AIsports Taekwondo System" },
      tagline: { ko: "AI 심판 도입한 태권도 대회 — 랭킹·매니저 페이지 담당" },
      description: {
        ko: "AI 심판이 도입된 태권도 대회 시스템에서 랭킹 시스템과 매니저 페이지를 담당. 팀 협업 프로젝트.",
      },
      problem: { ko: "수기 점수 집계와 종이 출석으로 대회 운영이 느림. 심판 주관 편차도 큼." },
      approach: { ko: "AI 심판 모듈을 도입하고, 랭킹 자동 집계 + 매니저용 운영 화면을 Next.js + MongoDB 로 구축." },
      outcome: { ko: "운영 시간 단축 + 일관된 점수. 매니저 페이지로 대회 흐름 한눈에 관리." },
      techs: ["Next.js", "MongoDB", "TypeScript"],
      year: 2024,
      githubUrl: "https://github.com/Jiwon-iii/AIsports-face-attendance",
      liveUrl: "",
      images: [],
      published: true,
    },
    {
      slug: "department-board",
      type: "other",
      order: 0,
      title: { ko: "학과 전자게시판" },
      tagline: { ko: "관리자가 글 올리면 학과 복도 TV에 자동 표시" },
      description: { ko: "Next.js + Supabase. 관리자 페이지에서 작성한 콘텐츠가 학내 디스플레이로 자동 전송." },
      techs: ["Next.js", "Supabase", "TypeScript"],
      year: 2024,
      githubUrl: "",
      liveUrl: "",
      images: [],
      published: true,
    },
    // ── 연습용 (간략 리스트로 표시) ─────────────────────
    {
      slug: "shop-nextjs",
      type: "practice",
      order: 0,
      title: { ko: "shop-nextjs" },
      tagline: { ko: "Next.js 기반 쇼핑몰 — 장바구니·결제·관리자" },
      description: { ko: "Next.js 14 App Router 로 만든 쇼핑몰 연습작." },
      techs: ["Next.js", "TypeScript", "Tailwind"],
      year: 2024,
      githubUrl: "https://github.com/Jiwon-iii/shop-nextjs-practice",
      liveUrl: "",
      images: [],
      published: true,
    },
    {
      slug: "voca-react",
      type: "practice",
      order: 1,
      title: { ko: "voca-react" },
      tagline: { ko: "단어 암기 웹앱 — 카드 인터랙션·로컬 상태" },
      description: { ko: "React 로 만든 단어 암기 학습 도구." },
      techs: ["React", "TypeScript"],
      year: 2024,
      githubUrl: "https://github.com/Jiwon-iii/voca-react-practice",
      liveUrl: "",
      images: [],
      published: true,
    },
    {
      slug: "todolist-nextjs",
      type: "practice",
      order: 2,
      title: { ko: "todolist-nextjs" },
      tagline: { ko: "Next.js 풀스택 투두 — CRUD·라우팅 다지기" },
      description: { ko: "Next.js 풀스택 투두리스트 연습작." },
      techs: ["Next.js", "TypeScript"],
      year: 2023,
      githubUrl: "https://github.com/Jiwon-iii/Todolist-nextjs-project",
      liveUrl: "",
      images: [],
      published: true,
    },
    {
      slug: "us-taekwondo",
      type: "building",
      order: 0,
      title: { ko: "미국 태권도 운영 시스템" },
      tagline: { ko: "미국 기업 협업 — 전체 시스템 설계 진행 중" },
      description: { ko: "미국 태권도 도장 운영 전반을 다루는 SaaS 를 미국 기업과 협업으로 설계·구현 중." },
      techs: ["Next.js", "TypeScript"],
      year: 2026,
      githubUrl: "",
      liveUrl: "",
      images: [],
      published: true,
    },
    {
      slug: "local-commerce-ai",
      type: "building",
      order: 1,
      title: { ko: "로컬 커머스 관광 AI" },
      tagline: { ko: "관광바우처 사업의 관광 AI 기능 개발 (한국 기업 협업)" },
      description: { ko: "관광 관련 AI 기능 개발을 담당. AI 통합 풀스택 작업의 두 번째 증명." },
      techs: ["Next.js", "AI", "API"],
      year: 2026,
      githubUrl: "",
      liveUrl: "",
      images: [],
      published: true,
    },
  ]
  for (const w of works) {
    await upsertBySlug(db, "works", w)
  }

  // ── Education ────────────────────────────────────────
  const education = [
    {
      slug: "edu-1",
      order: 0,
      schoolName: { ko: "○○대학교" },
      major: { ko: "컴퓨터공학 / 소프트웨어 관련 전공" },
      period: { start: "2023", end: "현재" },
      note: { ko: "웹·AI 관련 교과 이수. 학교 프로젝트로 풀스택 웹 다수." },
      published: true,
    },
    {
      slug: "edu-2",
      order: 1,
      schoolName: { ko: "○○고등학교" },
      major: { ko: "졸업" },
      period: { start: "2020", end: "2023" },
      note: { ko: "(어드민에서 수정 가능)" },
      published: true,
    },
  ]
  for (const e of education) await upsertBySlug(db, "education", e)

  // ── Experience ────────────────────────────────────────
  const experience = [
    {
      slug: "exp-1",
      order: 0,
      title: { ko: "기계학습 / AI 통합 자기학습" },
      orgName: { ko: "개인 학습 · 진행 중" },
      period: { start: "2025", end: "현재" },
      techs: ["Python", "PyTorch", "OpenAI API"],
      description: { ko: "웹 제품에 AI 기능을 통합하는 패턴 학습 중." },
      published: true,
    },
    {
      slug: "exp-2",
      order: 1,
      title: { ko: "AIsports 태권도 대회 시스템 개발" },
      orgName: { ko: "팀 협업" },
      period: { start: "2024", end: "2024" },
      techs: ["Next.js", "MongoDB"],
      description: { ko: "랭킹 시스템 + 매니저 페이지 담당. 영웅 프로젝트로 채택." },
      published: true,
    },
    {
      slug: "exp-3",
      order: 2,
      title: { ko: "학과 전자게시판 개발" },
      orgName: { ko: "학내 프로젝트" },
      period: { start: "2024", end: "2024" },
      techs: ["Next.js", "Supabase"],
      description: { ko: "관리자 페이지 → 학내 복도 TV 자동 표시 시스템." },
      published: true,
    },
  ]
  for (const e of experience) await upsertBySlug(db, "experience", e)

  // ── Skills ────────────────────────────────────────
  // 카테고리: main(주력) / usable(활용 가능). 학습 중·호기심 다 usable 로 통합.
  const skills = [
    { slug: "skill-nextjs",  order: 0, category: "main",   name: "Next.js",     level: { ko: "능숙" }, published: true },
    { slug: "skill-ts",      order: 1, category: "main",   name: "TypeScript",  level: { ko: "능숙" }, published: true },
    { slug: "skill-react",   order: 2, category: "main",   name: "React",       level: { ko: "능숙" }, published: true },
    { slug: "skill-mongo",   order: 3, category: "main",   name: "MongoDB",     level: { ko: "실무" }, published: true },
    { slug: "skill-node",    order: 4, category: "main",   name: "Node.js",     level: { ko: "실무" }, published: true },
    { slug: "skill-ml",      order: 0, category: "usable", name: "기계학습",            level: { ko: "활용 가능" }, published: true },
    { slug: "skill-openai",  order: 1, category: "usable", name: "OpenAI API",         level: { ko: "활용 가능" }, published: true },
    { slug: "skill-embed",   order: 2, category: "usable", name: "임베딩 / 벡터 검색",   level: { ko: "활용 가능" }, published: true },
    { slug: "skill-supabase",order: 3, category: "usable", name: "Supabase",           level: { ko: "활용 가능" }, published: true },
    { slug: "skill-arduino", order: 4, category: "usable", name: "아두이노 / 임베디드", level: { ko: "활용 가능" }, published: true },
  ]
  for (const s of skills) await upsertBySlug(db, "skills", s)

  // 기존 learning/curiosity 카테고리로 저장된 스킬을 usable 로 마이그레이션
  await db.collection("skills").updateMany(
    { category: { $in: ["learning", "curiosity"] } },
    { $set: { category: "usable", updatedAt: new Date() } },
  )

  // ── Settings ────────────────────────────────────────
  await upsertSingleton(db, "settings", {
    slug: "main",
    siteName: { ko: "신지원 Portfolio", ja: "シン・ジウォン Portfolio", en: "Shin Jiwon Portfolio" },
    metaDescription: { ko: "Next.js로 풀스택 웹을 만들면서 거기에 AI를 박아넣는 개발자." },
    metaKeywords: ["신지원", "포트폴리오", "Next.js", "AI", "풀스택"],
    enabledLanguages: ["ko"],
    defaultLanguage: "ko",
    ogImageUrl: "",
    updatedAt: new Date(),
  })

  console.log("\n✓ 시드 완료. http://localhost:3000 에서 확인.")
  await client.close()
}

async function upsertSingleton(db: ReturnType<MongoClient["db"]>, collection: string, doc: Record<string, unknown>) {
  const existing = await db.collection(collection).findOne({ slug: doc.slug })
  if (existing && !FORCE) {
    console.log(`· ${collection} skip (이미 존재. 강제 덮어쓰기는 --force)`)
    return
  }
  await db.collection(collection).updateOne({ slug: doc.slug }, { $set: doc }, { upsert: true })
  console.log(`· ${collection} upsert`)
}

async function upsertBySlug(db: ReturnType<MongoClient["db"]>, collection: string, doc: Record<string, unknown>) {
  const existing = await db.collection(collection).findOne({ slug: doc.slug })
  if (existing && !FORCE) {
    console.log(`· ${collection}/${doc.slug} skip`)
    return
  }
  const now = new Date()
  const payload = { ...doc, createdAt: existing?.createdAt ?? now, updatedAt: now }
  // Skills 컬렉션은 slug 가 스키마에 없음(유니크 키 용도). 다른 컬렉션도 마찬가지.
  await db.collection(collection).updateOne({ slug: doc.slug }, { $set: payload }, { upsert: true })
  console.log(`· ${collection}/${doc.slug} upsert`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

// _id 사용 안 해서 import 만 해두고 미사용 경고 방지
void ObjectId
