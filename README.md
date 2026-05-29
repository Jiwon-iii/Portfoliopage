# 신지원 포트폴리오 / シン・ジウォン ポートフォリオ

---

## 🇰🇷 한국어

> **"AI와 웹을 연결해 새로운 가치를 만드는 개발자"**

개발자 **신지원**의 개인 포트폴리오 사이트입니다.
지금까지의 작업물, 사용 기술, 경력, 학력을 한 페이지에 정리했습니다.

### 사이트 구성

- **Hero** — 자기소개와 한 줄 명함
- **About** — 어떤 사람인지, 어떤 방식으로 일하는지
- **Skills** — 다루는 기술 스택과 숙련도
- **Featured Works** — 대표 프로젝트 (상세 페이지 포함)
- **Other Works** — 사이드 프로젝트 및 실험
- **Timeline** — 학력 · 경력 타임라인
- **Contact** — 연락 수단

### 특징

- **풀스택 한 코드베이스** — 공개 사이트와 콘텐츠 관리(CMS)를 함께 운영
- **즉시 반영** — 콘텐츠를 수정하면 공개 사이트에 바로 반영되는 On-Demand ISR
- **다국어 지원 구조** — 한국어 · 일본어 · 영어를 염두에 둔 데이터 모델
- **반응형 디자인** — 모바일부터 데스크톱까지 자연스러운 레이아웃

### 사용 기술

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui · MongoDB Atlas · Vercel Blob · Zod

### 코드 구조

App Router의 라우트 그룹으로 공개 사이트와 어드민을 분리하고, 미들웨어에서 `/admin/*` 경로를 보호합니다.

```
app/
├── (site)/          # 공개 사이트 — 단일 페이지에 9개 섹션
├── (admin)/         # 어드민 CMS — iron-session 인증
├── login/           # 비밀번호 로그인
└── api/             # auth, works, hero, upload, revalidate ...

components/
├── ui/              # shadcn/ui 기본 컴포넌트
├── site/            # 공개 사이트 섹션 컴포넌트
└── admin/           # 어드민 폼 컴포넌트

lib/
├── db.ts            # MongoDB connection 캐싱
├── auth.ts          # iron-session 세션
├── i18n.ts          # 다국어 헬퍼 (pickLang)
├── schemas/         # Zod 스키마 — 폼 / API / DB 단일 소스
└── repo/            # 컬렉션별 CRUD 함수
```

### 데이터 흐름

1. **저장** — 어드민 폼 → Zod 검증 → API 라우트 → MongoDB
2. **재검증** — 저장 성공 시 `revalidatePath("/", "layout")` 호출
3. **반영** — 다음 방문자가 갱신된 공개 사이트를 즉시 확인

### 설계 포인트

- **Zod 3중 재사용** — 동일한 스키마를 폼 검증, API 검증, DB 입력 검증에 모두 활용
- **i18n 데이터 모델** — 모든 텍스트 필드를 `{ ko, ja?, en? }` 중첩 구조로 저장. 언어 추가 시 스키마 변경 없이 확장 가능
- **이미지 처리** — Vercel Blob 직접 업로드, URL만 DB에 저장
- **세션** — iron-session으로 암호화된 쿠키 기반 인증, 미들웨어에서 라우트 가드

---

## 🇯🇵 日本語

> **「AI と Web をつなぎ、新しい価値を生み出すエンジニア」**

エンジニア **シン・ジウォン** の個人ポートフォリオサイトです。
これまでの制作物、使用技術、職歴、学歴を 1 ページにまとめています。

### サイト構成

- **Hero** — 自己紹介と一言キャッチコピー
- **About** — どんな人物か、どんな働き方をするか
- **Skills** — 扱える技術スタックと習熟度
- **Featured Works** — 代表プロジェクト (詳細ページ付き)
- **Other Works** — サイドプロジェクトや実験
- **Timeline** — 学歴・職歴のタイムライン
- **Contact** — 連絡手段

### 特徴

- **フルスタック単一コードベース** — 公開サイトとコンテンツ管理 (CMS) を一体運用
- **即時反映** — コンテンツを更新するとすぐに公開サイトへ反映される On-Demand ISR
- **多言語対応構造** — 韓国語・日本語・英語を想定したデータモデル
- **レスポンシブデザイン** — モバイルからデスクトップまで自然なレイアウト

### 使用技術

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui · MongoDB Atlas · Vercel Blob · Zod

### コード構成

App Router のルートグループで公開サイトと管理画面を分離し、ミドルウェアで `/admin/*` のパスを保護しています。

```
app/
├── (site)/          # 公開サイト — 1 ページに 9 セクション
├── (admin)/         # 管理 CMS — iron-session 認証
├── login/           # パスワードログイン
└── api/             # auth, works, hero, upload, revalidate ...

components/
├── ui/              # shadcn/ui ベースコンポーネント
├── site/            # 公開サイト用セクション
└── admin/           # 管理画面用フォーム

lib/
├── db.ts            # MongoDB コネクションキャッシュ
├── auth.ts          # iron-session セッション
├── i18n.ts          # 多言語ヘルパー (pickLang)
├── schemas/         # Zod スキーマ — フォーム / API / DB 単一ソース
└── repo/            # コレクション別 CRUD 関数
```

### データフロー

1. **保存** — 管理画面フォーム → Zod バリデーション → API ルート → MongoDB
2. **再検証** — 保存成功時に `revalidatePath("/", "layout")` を呼び出し
3. **反映** — 次の訪問者が即座に更新後の公開サイトを閲覧

### 設計ポイント

- **Zod 三層再利用** — 同一スキーマをフォーム検証 / API 検証 / DB 入力検証に共通利用
- **i18n データモデル** — すべてのテキストフィールドを `{ ko, ja?, en? }` のネスト構造で保存。言語追加時もスキーマ変更不要
- **画像処理** — Vercel Blob に直接アップロードし、URL のみ DB に保存
- **セッション** — iron-session による暗号化 Cookie 認証、ミドルウェアでルートガード
