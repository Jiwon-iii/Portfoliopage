# 포트폴리오 사이트 설계 문서

작성일: 2026-05-19
작성 도구: /office-hours
상태: DRAFT (디자인·구현 전 합의된 뼈대)

---

## 1. 목적

본인 취업 활동용 포트폴리오 사이트. 채용 담당자가 30초 안에 "이 사람은 어떤 개발자인지" 판단할 수 있도록 만든다.

## 2. 한 줄 명함 (Hero에 박힐 문구)

> **"Next.js로 풀스택 웹을 만들면서 거기다 AI 기능을 박아넣는 개발자"**

핵심: 그냥 "풀스택"이 아니라 **"AI 통합 풀스택"** 이라는 교집합 포지셔닝.
근거: ChatGPT 이후 기존 웹에 AI 기능을 붙일 수 있는 풀스택 수요가 큰데, 너는 Next.js 결과물도 충분히 있고 ML도 공부 중이라 이 자리에 진입 가능.

## 3. 개인 정보 (Hero / Contact 에 박힐 내용)

- **이름:** 신지원 (Shin Jiwon / シン・ジウォン)
- **GitHub:** https://github.com/Jiwon-iii
- **이메일:** syrima03@gmail.com (또는 syrima03@naver.com)
- **이력서:** PDF 다운로드가 아니라 사이트에 풀어서 임베딩 (학력·경력·자기소개 섹션으로 표시)

## 4. 자산 인벤토리 (autoplan 검증 후 정정)

### Featured 영웅 프로젝트 (1순위)
- **AI 스포츠 (AIsports)** ⭐ — **AI 심판 도입한 태권도 대회 시스템**. 사용자 역할: 랭킹 시스템 + 매니저 페이지 담당. 스택: MongoDB + Next.js + JavaScript. 팀 프로젝트.
  - 명함 "AI 통합 풀스택"의 핵심 증거
  - 협업 경험 + AI 통합 + 매니저 시스템 설계 다 들어감

### Other Works (그리드 카드)
1. **학과 전자게시판** — 학과 관리자가 글 올리면 학내 복도 TV에 자동 표시. **Next.js + Supabase**.
   - ⭐ portfolio 사이트와 **동일 아키텍처** (관리자 페이지 + 자동 디스플레이). 면접에서 "같은 패턴 이미 만들어봤다" 강력 신뢰 신호
2. **shop-nextjs** — Next.js 쇼핑몰 (공개 GitHub)
3. **voca-react** — React 단어 암기 웹앱 (공개 GitHub)
4. **todolist-nextjs** — Next.js 풀스택 투두 (공개 GitHub)
5. **아두이노 프로젝트** — 임베디드/하드웨어. 호기심 폭 보여주는 용

### Currently Building (진행 중 섹션)
1. **미국 태권도 운영 시스템** — 미국 기업과 협업. 전체 시스템 설계 진행 중.
   - 국제 협업 + 시스템 설계 경험 신호
2. **로컬 커머스 관광 AI 기능** — 한국 기업 협업. 관광바우처 사업의 관광 관련 AI 기능 개발 담당.
   - ⭐ **AI 통합 두 번째 증명**. AIsports만이 아니라 두 번째 실제 AI 통합 작업

### P2 (3개+ 프로젝트) 검증 결과
**통과 ✓** — Featured 1 + Other Works 5 + Currently Building 2 = 총 8개 메인 콘텐츠 (+ 보너스로 GitHub 연습작·아두이노)

### 명함 강화 포인트 (About 섹션에서 풀어쓰기)
사용자의 진짜 패턴: **AI 통합 + 관리자 페이지를 갖춘 풀스택 시스템 빌더**
- AIsports = AI 통합 + 매니저 페이지
- 학과 전자게시판 = 관리자 페이지 + 자동 디스플레이
- 미국 태권도 = 전체 시스템 설계 (진행)
- 로컬 커머스 관광 = AI 기능 통합 (진행)

한 줄 명함 ("Next.js로 AI를 박아넣는 풀스택 개발자")는 그대로 유지, About 섹션에서 위 패턴 풀어쓰기.

### 학습 중
- 기계학습 (AI 통합 능력 강화를 위해)

## 5. 사이트 구조 (뼈대 v2 — 이력서 임베딩 반영)

채택 방향: **A안 — 완성된 풀스택이 메인, AI는 'Currently Building' 섹션**
이력서는 PDF 첨부가 아니라 사이트에 풀어서 트렌디하게 임베딩.

```
┌─────────────────────────────────────────────┐
│ 1. HERO                                     │
│   - "신지원 / Shin Jiwon"                    │
│   - 한 줄 명함:                              │
│     "Next.js로 AI를 박아넣는 풀스택 개발자"   │
│   - GitHub · Email 링크                     │
│   - 스크롤 유도 미세 인디케이터               │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│ 2. FEATURED PROJECT (영웅 1개)              │
│   - AIsports-face-attendance 풀폭 배치       │
│   - 어떤 AI(얼굴인식)·어떤 풀스택 구조·       │
│     무엇을 해결했는지 한 화면에 압축           │
│   - 데모 영상/움짤·코드 일부·라이브 URL       │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│ 3. OTHER PROJECTS (그리드 카드)              │
│   - shop-nextjs / voca-react /              │
│     Todolist-nextjs + 비공개 정리한 것       │
│   - 각 카드: 썸네일 / 한 줄 / 기술 / 링크     │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│ 4. CURRENTLY BUILDING                       │
│   - "In Progress" 배지                      │
│   - 진행 중인 AI 통합 작업 1~2개             │
│   - 완성 시 Featured로 승격                  │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│ 5. ABOUT ME (이력서를 풀어쓴 자기소개)        │
│   - 한 문단 자기소개 (왜 개발자가 되었나)    │
│   - 트렌디한 이미지/일러스트 1개             │
│   - "지금 관심 가진 것" 짧게                 │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│ 6. EDUCATION (학력 — 타임라인 형식)          │
│   - 세로 타임라인 UI                         │
│   - 학교/학과/기간/한 줄 코멘트              │
│   - 관련 수업이나 활동 핵심만                │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│ 7. EXPERIENCE (경력/활동 — 타임라인)         │
│   - 인턴/알바/동아리/스터디/공모전 등        │
│   - 기간 + 무엇을 했는지 + 배운 것           │
│   - 학생 신분이면 학교 프로젝트도 포함        │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│ 8. SKILLS & LEARNING                        │
│   - 주력: Next.js / React / TypeScript /    │
│     MongoDB / Node                          │
│   - 학습 중: 기계학습 (AI 통합용)            │
│   - 호기심: 아두이노 / 임베디드              │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│ 9. CONTACT (Footer)                         │
│   - syrima03@gmail.com                      │
│   - github.com/Jiwon-iii                    │
│   - 복사 버튼 / 메일 보내기 인터랙션          │
└─────────────────────────────────────────────┘
```

### 트렌디 디자인 키워드 (다음 /design-consultation 에 넘길 힌트)
- 풀폭 영웅 섹션 (Featured Project 풀폭)
- 세로 타임라인 (Education / Experience)
- 인터랙티브 컨택 (이메일 복사·메일 열기 한 클릭)
- 모노톤 + 포인트 컬러 1개 또는 그라데이션
- 한·영 토글 가능성 (일본어까지 가면 シン・ジウォン 활용)

### 어드민 페이지 (Phase 1 — admin-preview.html 참고)
- **레이아웃:** 상단바 (브랜드·미리보기·저장·발행·로그아웃) + 좌측 사이드바 (섹션 네비) + 메인 영역
- **사이드바 항목:**
  - 대시보드
  - 콘텐츠: Hero / Featured / Other Works / Currently Building / About / Education / Experience / Skills
  - 미디어: 이미지·영상
  - 설정: 다국어 · SEO · 계정
- **콘텐츠 리스트:** 드래그 정렬 핸들 + 썸네일 + 이름 + 한 줄 설명 + 태그 + 공개/초안/숨김 상태 + 연도 + 편집 버튼
- **편집기:**
  - 언어 탭: 한국어 / 日本語 / English — 각 언어별 필드 따로 입력
  - AI 보조 작성 박스: GitHub URL → AI가 README 읽고 케이스 스터디 한국어 초안 생성
  - 필드: 이름·한 줄 설명·상세 설명(마크다운)·기술 태그·연도·GitHub URL·라이브 URL·이미지 업로드(최대 5장)
  - 노출 토글: 사이트 공개 / Featured 후보 / 진행 중 표시
  - 자동저장 인디케이터 + 마지막 수정 시간 + 정렬 순서 표시
- **이미지 업로드:** 드래그 드롭 + 미리보기 + 제거 버튼
- **다국어 폴백 정책:** JP/EN 비어있으면 KR로 자동 표시 (또는 "번역 준비 중" 옵션)

### 디자인 시스템 결정 (확정)
- **베이스 톤:** 쿨 오프화이트 + 인디고 액센트 (Linear/Stripe 무드)
- **배경:** #F4F4F5 (zinc-100, 쿨 오프화이트)
- **표면:** #FFFFFF
- **본문 잉크:** #18181B (zinc-900)
- **약한 텍스트:** #71717A (zinc-500)
- **보더:** #E4E4E7 (zinc-200)
- **액센트:** #6366F1 (인디고-500)
- **글꼴:**
  - 큰 글자 / 제목: **Geist** (Vercel 자체 글꼴 — Next.js 정체성 시그널) + Pretendard 헤비 한글 폴백
  - 본문: Pretendard Variable
  - 이탤릭 강조: Instrument Serif (예: *AI* 단어)
  - 모노 / 번호 / 기술 라벨: JetBrains Mono
- **레이아웃:** 섹션 번호 01/08, 얇은 가로선이 디자인 요소, Featured는 풀폭 에디토리얼, Other Works는 번호 매긴 가로 리스트
- **무드:** 한국 dev portfolio 베이스 + 차분한 SaaS 톤 (Linear/Stripe·Vercel 영향)

## 5. 전제 (다음 단계에서 이게 깨지면 뼈대도 다시)

1. 명함은 "Next.js + AI 통합 풀스택" 으로 간다. (취업 시점까지 유효)
2. 완성된 Next.js 프로젝트가 메인에 올릴 만큼 최소 3개는 있다.
3. AI 통합 작업은 포트폴리오 런칭 후에도 계속 업데이트한다는 가정.
4. 사이트는 영어/한글 중 한글 우선 (한국 시장 타겟). 필요시 영어 토글 추가.

## 6. 아키텍처 (확정)

**채택: 풀스택 CMS 구조** — 정적 사이트가 아니라 어드민으로 콘텐츠 수정 가능한 진짜 풀스택 앱.

### 의미
- 포트폴리오 사이트 자체가 영웅 프로젝트의 라이브 증거 (별도 데모 불필요)
- MongoDB 경험이 죽은 자산이 아니라 이 사이트의 DB로 살아있는 증거
- 어드민에 AI 기능 1개만 박으면 "AI 통합 풀스택" 명함이 사이트 자체로 증명됨 (재귀)

### 추가 컴포넌트
- 데이터베이스: MongoDB (사용자 기존 경험 활용)
- 어드민 로그인 (본인만 접근)
- CRUD: 프로젝트 / 학력 / 경력 / 자기소개 / 스킬
- 이미지 업로드 (프로젝트 스크린샷 / 데모 GIF)
- 배포 환경 (Next.js + MongoDB Atlas 또는 자체 호스팅)

### MVP 전략 (출시 1차)
**옵션 C 채택: 어드민 + 최소 CRUD 같이, 정렬·고급 기능은 V2**
- 풀스택 증거 + 출시 속도 균형
- 면접 때 "지금 보는 이 사이트가 어드민으로 실시간 관리되는 풀스택 작품" 이라고 말 가능

### AI 기능 (V1 또는 V1.5)
어드민에 AI 1개 박아서 명함 자기증명:
- 후보 1: GitHub URL 넣으면 → AI가 README 읽고 한국어 케이스 스터디 초안 생성
- 후보 2: 자기소개 톤 변환 (친근/격식/영문)
- 후보 3: 프로젝트 스크린샷 자동 alt text + 한 줄 요약 생성

### 기술 스택 결정 (확정)
- **호스팅 + 배포:** **Vercel** (Next.js와 가장 자연스러움, 무료 티어로 시작)
- **DB (텍스트 데이터):** **MongoDB Atlas 무료 티어 (512MB)**
  - 사용자가 Supabase 경험도 있지만 MongoDB로 결정 (랭킹 사이트·AIsports 경험 활용)
  - 컬렉션: hero / featured / works / building / about / education / experience / skills / media / settings
  - 다국어: 각 필드에 `_ko`, `_ja`, `_en` suffix 또는 nested `{ ko, ja, en }` 구조
- **이미지 저장소:** **Vercel Blob (무료 5GB)**
  - 같은 호스팅 환경에 묶여 설정 단순
  - 자동 CDN 캐싱
- **어드민 인증:** **환경변수 비밀번호 1개**
  - 1인 어드민이라 NextAuth/OAuth는 오버
  - `.env.local` 에 `ADMIN_PASSWORD` 박고, 로그인 폼이 일치하면 세션 쿠키 발급
- **도메인:** 추후 결정 (Vercel 기본 도메인으로 출시도 가능)

### 엔지니어링 결정 (락인 — /plan-eng-review 결과)

**7개 결정 요약:**

| 항목 | 결정 |
|---|---|
| D1. 다국어 필드 구조 | **중첩 객체** `{ ko, ja, en }` (suffix 아님) |
| D2. 인증 | **iron-session** (암호화 쿠키 세션) |
| D3. 렌더링 | **SSG + On-Demand ISR** (어드민 저장 시 revalidate) |
| D4. DB 드라이버 | **네이티브 mongodb + Zod** (Mongoose 아님) |
| D5. AI 기능 | **없음** (AIsports 프로젝트가 AI 능력 단독 증명) |
| D6. 스타일링 | **Tailwind + shadcn/ui** (gaisportmanager 와 동일) |
| D7. 폴더 그룹 | **(site) + (admin) 두 그룹 분리** |

### DB 스키마 (MongoDB)

```ts
// collection: works  (Featured / Other / Building 다 여기)
{
  _id: ObjectId,
  slug: string,
  type: 'featured' | 'other' | 'building',
  order: number,

  title:       { ko: string, ja?: string, en?: string },
  tagline:     { ko: string, ja?: string, en?: string },
  description: { ko: string, ja?: string, en?: string },  // 마크다운

  // Featured 전용 (PROBLEM / APPROACH / OUTCOME)
  problem?:  { ko: string, ja?: string, en?: string },
  approach?: { ko: string, ja?: string, en?: string },
  outcome?:  { ko: string, ja?: string, en?: string },

  techs: string[],            // ['Next.js', 'TypeScript', 'MongoDB', ...]
  year: number,
  githubUrl?: string,
  liveUrl?: string,
  images: { url: string, alt?: string }[],

  published: boolean,
  createdAt: Date,
  updatedAt: Date
}

// collection: education
{ _id, order, schoolName, major, period: {start, end}, note, published, timestamps }

// collection: experience
{ _id, order, title, orgName, period, techs, description, published, timestamps }

// collection: skills
{ _id, order, category: 'main'|'learning'|'curiosity', name, level, published, timestamps }

// collection: hero (single document)
{ _id, name, tagline, metaLeft, location, focus, status, github, email,
  portrait: { url }, updatedAt }

// collection: about (single document)
{ _id, heading, paragraphs: [{ ko, ja?, en? }], updatedAt }

// collection: settings (single document)
{ _id, siteName, meta: { description, keywords },
  languages: ['ko', 'ja', 'en'],
  defaultLanguage: 'ko',
  updatedAt }
```

### 폴더 구조

```
Portfolio/
├── app/
│   ├── (site)/                    # 메인 사이트 그룹
│   │   ├── layout.tsx             # 사이트 레이아웃 (topbar/marquee/footer)
│   │   └── [lang]/page.tsx        # /, /ja, /en — 9개 섹션 다 표시
│   ├── (admin)/                   # 어드민 그룹 (별도 레이아웃)
│   │   ├── layout.tsx             # 어드민 레이아웃 (sidebar + navbar)
│   │   ├── login/page.tsx         # 비공개 - /login
│   │   └── admin/
│   │       ├── dashboard/page.tsx
│   │       ├── hero/page.tsx
│   │       ├── works/
│   │       │   ├── page.tsx           # 리스트 (테이블)
│   │       │   └── [id]/page.tsx      # 편집기
│   │       ├── education/page.tsx
│   │       ├── experience/page.tsx
│   │       ├── skills/page.tsx
│   │       ├── about/page.tsx
│   │       └── media/page.tsx
│   ├── api/
│   │   ├── auth/{login,logout}/route.ts
│   │   ├── works/route.ts             # GET (list), POST (create)
│   │   ├── works/[id]/route.ts        # GET, PATCH, DELETE
│   │   ├── education/route.ts + [id]/route.ts
│   │   ├── experience/route.ts + [id]/route.ts
│   │   ├── skills/route.ts + [id]/route.ts
│   │   ├── hero/route.ts              # PATCH only (single doc)
│   │   ├── about/route.ts             # PATCH only
│   │   ├── upload/route.ts            # Vercel Blob 업로드
│   │   └── revalidate/route.ts        # On-demand ISR 트리거
│   ├── layout.tsx                     # 루트 (Geist + Pretendard preload)
│   └── globals.css
├── components/
│   ├── ui/                            # shadcn/ui (button, input, table, dialog...)
│   ├── site/                          # 메인 사이트
│   │   ├── topbar.tsx, hero.tsx, marquee.tsx
│   │   ├── featured.tsx, other-works.tsx, building.tsx
│   │   ├── about.tsx, education.tsx, experience.tsx
│   │   ├── skills.tsx, contact.tsx, footer.tsx
│   │   └── lang-toggle.tsx
│   └── admin/                         # 어드민
│       ├── sidebar.tsx, navbar.tsx
│       ├── work-table.tsx, work-editor.tsx
│       ├── lang-tabs.tsx, image-upload.tsx
│       └── toggle-switch.tsx
├── lib/
│   ├── db.ts                          # MongoDB connection 캐싱
│   ├── auth.ts                        # iron-session 설정·옵션
│   ├── i18n.ts                        # 언어 선택 + 폴백 로직 (ja → ko)
│   ├── schemas/                       # Zod 스키마 (폼+API+DB 3중 재사용)
│   │   ├── work.ts, education.ts, experience.ts
│   │   ├── skill.ts, hero.ts, about.ts
│   │   └── i18n-field.ts              # `i18nField = z.object({ ko, ja?, en? })`
│   └── repo/                          # DB 접근 함수
│       ├── works.ts, education.ts, experience.ts
│       ├── skills.ts, hero.ts, about.ts
│       └── media.ts
├── middleware.ts                      # /admin/* 경로 보호 + 언어 라우팅
├── public/portrait.jpg                # 증명사진 (또는 어드민 업로드 후 Vercel Blob)
├── .env.local                         # ADMIN_PASSWORD, MONGODB_URI, BLOB_TOKEN, SESSION_SECRET
└── package.json
```

### 인증 흐름 (iron-session)

```
[방문자]                    [서버]                        [DB / Cookie]
   │                           │                                │
   │ GET /login                │                                │
   │──────────────────────────>│                                │
   │ 로그인 폼 표시              │                                │
   │<──────────────────────────│                                │
   │                           │                                │
   │ POST /api/auth/login      │                                │
   │ { password: 'xxx' }       │                                │
   │──────────────────────────>│                                │
   │                           │ env.ADMIN_PASSWORD 와 비교        │
   │                           │ ────────────────────────────────│
   │                           │                                │
   │                           │ 일치 시 iron-session 쿠키 발급     │
   │                           │ (HttpOnly, Secure, SameSite=Lax) │
   │ Set-Cookie: session=...   │ ──────────────────────────────>│
   │<──────────────────────────│                                │
   │                           │                                │
   │ GET /admin/dashboard      │                                │
   │ Cookie: session=...       │                                │
   │──────────────────────────>│                                │
   │                           │ middleware.ts 검증             │
   │                           │ 유효 → 통과, 무효 → /login redirect│
   │ 어드민 페이지 응답           │                                │
   │<──────────────────────────│                                │
```

### 이미지 업로드 흐름 (Vercel Blob)

```
[어드민 폼]              [클라이언트]            [서버 API]         [Vercel Blob]
    │                       │                       │                  │
    │ 파일 선택 / 드롭          │                       │                  │
    │──────────────────────>│                       │                  │
    │                       │ 검증 (≤5MB, image/*)   │                  │
    │                       │ ──────────────────────│                  │
    │                       │                       │                  │
    │                       │ POST /api/upload      │                  │
    │                       │ multipart/form-data   │                  │
    │                       │──────────────────────>│                  │
    │                       │                       │ session 검증       │
    │                       │                       │ ─────────────────│
    │                       │                       │ put(file)         │
    │                       │                       │─────────────────>│
    │                       │                       │ URL 반환           │
    │                       │ { url, alt? }         │<─────────────────│
    │                       │<──────────────────────│                  │
    │                       │                       │                  │
    │ 폼 state에 URL 추가     │                       │                  │
    │<──────────────────────│                       │                  │
    │ ...폼 저장 시 DB엔 URL만 저장 (파일은 Blob에)                       │
```

### On-Demand ISR (저장 → 즉시 반영)

```
[어드민]              [API]                 [DB]                  [캐시]
   │                   │                     │                      │
   │ PATCH /api/works/X│                     │                      │
   │──────────────────>│                     │                      │
   │                   │ Zod 검증 + UPDATE   │                      │
   │                   │ ───────────────────>│                      │
   │                   │                     │                      │
   │                   │ revalidatePath('/ko', '/ja', '/en')         │
   │                   │ ──────────────────────────────────────────>│
   │                   │                     │ 캐시 무효화            │
   │                   │                     │                      │
   │ 200 OK            │                     │                      │
   │<──────────────────│                     │                      │
   │                                                                │
   │ 다음 방문자 / 접속 → SSG 재생성된 새 버전 응답                     │
```

### 디자인 HTML → React 컴포넌트 매핑

| design-preview.html 섹션 | React 컴포넌트 |
|---|---|
| topbar | `components/site/topbar.tsx` + `lang-toggle.tsx` |
| marquee | `components/site/marquee.tsx` |
| hero (이름 + 증명사진 + 메타) | `components/site/hero.tsx` (portrait 포함) |
| Featured | `components/site/featured.tsx` |
| Other Works (리스트) | `components/site/other-works.tsx` |
| Currently Building | `components/site/building.tsx` |
| About | `components/site/about.tsx` |
| Education / Experience 타임라인 | `components/site/timeline.tsx` 공용 + 페이지별 props |
| Skills 3컬럼 | `components/site/skills.tsx` |
| Contact / Footer | `components/site/contact.tsx`, `footer.tsx` |

| admin-preview.html 섹션 | React 컴포넌트 |
|---|---|
| 사이드바 | `components/admin/sidebar.tsx` (shadcn Sheet + lucide-react) |
| 상단 navbar | `components/admin/navbar.tsx` |
| 필터 탭 | shadcn `Tabs` |
| 테이블 + 행 | shadcn `Table` + `work-table.tsx` |
| 편집기 (언어탭 + 폼) | shadcn `Tabs` + `work-editor.tsx` + `useForm + zodResolver` |
| 이미지 업로드 | `components/admin/image-upload.tsx` (드래그 드롭 + 미리보기) |
| 토글 스위치 | shadcn `Switch` |

### 환경변수 (.env.local)

```
MONGODB_URI=mongodb+srv://...      # MongoDB Atlas 연결 문자열
ADMIN_PASSWORD=...                  # 어드민 로그인 비밀번호
SESSION_SECRET=...                  # iron-session 암호화 키 (32바이트 랜덤)
BLOB_READ_WRITE_TOKEN=...           # Vercel Blob 토큰 (Vercel 대시보드에서 받음)
```

### NPM 의존성 (초기)

```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "react-dom": "18.x",
    "mongodb": "^6.x",
    "zod": "^3.x",
    "iron-session": "^8.x",
    "@vercel/blob": "^0.x",
    "react-hook-form": "^7.x",
    "@hookform/resolvers": "^3.x",
    "tailwindcss": "^3.x",
    "lucide-react": "^0.x",
    "@radix-ui/react-tabs": "^1.x",
    "@radix-ui/react-dialog": "^1.x",
    "@radix-ui/react-switch": "^1.x",
    "@radix-ui/react-tooltip": "^1.x",
    "class-variance-authority": "^0.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x"
  }
}
```
(shadcn/ui 컴포넌트 추가할 때마다 radix-ui 패키지 점진적으로 추가)

### Mongo 인덱스 (초기)

```ts
db.works.createIndex({ type: 1, order: 1, published: 1 })
db.works.createIndex({ slug: 1 }, { unique: true })
db.education.createIndex({ order: 1, published: 1 })
db.experience.createIndex({ order: 1, published: 1 })
db.skills.createIndex({ category: 1, order: 1, published: 1 })
```

### NOT in scope (이번에 일부러 안 함)

- **OAuth/소셜 로그인** — 1인 어드민, 비밀번호 1개로 충분
- **다중 사용자/팀** — 본인만 들어감
- **댓글·방명록** — 채용 portfolio 목적엔 노이즈
- **블로그 글 작성** — 이번 출시 후 V2에 고민
- **AI 기능** — AIsports 프로젝트가 단독 증명, 어드민 AI 박는 건 V2 또는 영구 보류
- **검색 (사이트 내)** — 콘텐츠 양이 적어 불필요
- **PWA / 오프라인** — 포트폴리오는 온라인 접근만
- **이메일 발송 (contact form)** — 메일 링크 (mailto:) 로 충분

### 다음 단계: 본격 코드 작성

1. `npm create next-app@latest portfolio` (TypeScript, Tailwind, App Router 선택)
2. shadcn/ui 초기화: `npx shadcn-ui@latest init`
3. MongoDB Atlas 무료 클러스터 생성 + 연결 문자열 .env.local 에 박기
4. Vercel Blob 토큰 발급 (Vercel 프로젝트 만든 후)
5. `lib/db.ts` connection 캐싱 구현
6. `lib/schemas/i18n-field.ts` 부터 시작 → 9개 컬렉션 스키마 정의
7. `lib/repo/*.ts` 각 컬렉션별 CRUD 함수
8. `app/api/*` API 라우트
9. `app/(admin)/login` 로그인 페이지 + iron-session
10. `app/(admin)/admin/*` 어드민 페이지들 (먼저 works부터)
11. `app/(site)/[lang]/page.tsx` 메인 사이트 페이지
12. design-preview.html 의 HTML/CSS → React 컴포넌트로 옮기기 (Tailwind 변환)
13. 시드 데이터 한 번 넣고 메인 사이트 확인
14. Vercel 배포 + 도메인

### 다국어 (i18n) 전략 — V1 = KR only / V1.5 = JP·EN (autoplan 조정)
- **V1 (즉시 출시):** **한국어 (KR) 만** 콘텐츠 채움. JP·EN 토글 UI는 우상단에 자리만 잡고 클릭 시 "V1.5 지원 예정" 안내 → 자동 KR 복귀
- **V1.5 (출시 후 1~2개월):** JP / EN 콘텐츠 어드민에서 채우고 토글 활성화
- **데이터 구조 (V1부터 잡아둠):** 중첩 객체 `{ ko: string, ja?: string, en?: string }` — JP/EN 필드는 optional, V1에선 비어있어도 OK
- **자기 이름 표기:** KR=신지원, JP=シン・ジウォン, EN=Shin Jiwon (V1.5)
- **이유:** 9개 섹션 × 3개 언어 콘텐츠 입력 부담이 V1 출시를 1~2주 늦춤. KR 우선 출시로 빠르게 세상에 내놓고 V1.5에 다국어 보강이 합리적

### V1 추가 디자인 항목 (autoplan Design 시각으로 발견)

기존 design-preview.html 은 happy path만 그려져 있어 V1에 다음 6가지 추가 명세 필요:

1. **로딩 / 에러 / 빈 상태 UI**
   - 이미지 로딩: Next.js `<Image>` placeholder="blur" + 스켈레톤
   - 어드민 저장 실패: 토스트 알림 (shadcn `Sonner` 또는 `useToast`)
   - 빈 상태: "아직 작업이 추가되지 않았어요" + 어드민 링크 (해당 섹션에 데이터 0개일 때)

2. **404 / 500 페이지** — `app/not-found.tsx` + `app/error.tsx` 에 디자인 시스템 적용된 페이지. 메인 사이트 톤과 일관성

3. **OG 메타 이미지 (링크 공유 카드)** — `app/opengraph-image.tsx` 동적 생성. Geist 폰트 + 인디고 액센트 + "신지원 / Portfolio · 2026" 표시

4. **폰트 로딩 전략** — `next/font/google` Geist + `next/font` Pretendard (CDN) preload + `font-display: swap`. FOUT 회피, CLS 최소화

5. **접근성 (WCAG AA)** — 색대비 확인 (#6366F1 on #FFFFFF = 4.5:1 통과 확인 필요), 모든 인터랙티브 요소 `:focus-visible` 스타일, 이미지 alt text 필수, 키보드 nav 지원

6. **모바일 반응형 검증** — 375px (iPhone SE), 768px (iPad) 두 breakpoint 에서 모든 섹션 확인. Featured 풀폭 → 모바일 단일컬럼 / Other Works 가로리스트 → 모바일 카드 / 어드민 사이드바 → 모바일 시트(Sheet)

### AIsports 데모 자산 — V1=정적 / V1.5=영상

- **V1:** 스크린샷 1-2장 + 텍스트 케이스 스터디 (PROBLEM / APPROACH / OUTCOME) 으로 출시 OK
- **V1.5 (1주~1개월 안):** 5-10초 데모 GIF 또는 mp4 추가. AI 제품은 "움직이는 증거" 가 임팩트 50% 좌우. 핸드폰으로 1회 촬영하면 끝

## 7. 첫 번째 과제 (The Assignment) — 콘텐츠는 어드민으로 넣으면 됨

> **중요한 전환:** 콘텐츠를 미리 글로 정리할 필요 없음. 어드민이 생기면 너가 직접 사이트에서 입력. 
> 다음 단계는 디자인·구조·DB 설계에 집중.

### 그래도 미리 결정 필요한 것
- **숨겨진 프로젝트 정리:** 비공개·로컬 Next.js 프로젝트 목록만 머릿속/메모에 (Featured 1개 + Others 3~4개 목표 충족 가능 여부)
- **이력서 정보 어디서 가져올지:** 기존 이력서 파일이 있으면 어드민 입력 단계에서 그대로 옮기면 됨
- **AI 기능 1개 어떤 걸로:** 위 후보 1·2·3 중 선택 (또는 다른 아이디어)
- **톤 방향:** 모던·미니멀 / 컬러풀·플레이풀 / 다크·테크 / 키치 → /design-consultation 에서 시안 비교

## 8. 다음 단계

1. **/design-consultation** — 디자인 시스템(폰트·색·여백·톤) 잡고 DESIGN.md 생성
2. **/plan-eng-review** — 기술 스택·폴더 구조·배포 방식 락인
3. **/design-html** — 승인된 디자인을 실제 HTML/CSS 코드로 변환

또는 **/autoplan** 으로 위 3개 자동 순회.

## 9. 관찰 (How you think)

- "여러 직무"라고 처음 답했다가, 실제 결과물을 짚어주니까 "Next.js 풀스택이 가장 많아" 로 자기 답을 수정함 → 자기 객관화 가능한 사람.
- "AI도 만들고 있어. 웹에 AI시스템을 구축하는 느낌으로" 이 문장이 이번 세션의 핵심. 본인 명함을 본인이 이미 알고 있었음. 그걸 한 줄로 정리만 안 했을 뿐.
- "지금 하고 있어 ing야" 라고 솔직하게 말한 거 좋음. 진행 중인 것까지 포트폴리오에 보이는 전략이 가능해진 이유.
