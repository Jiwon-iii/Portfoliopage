/**
 * 1회성 — DB에 입력된 한국어(ko) 콘텐츠의 일본어(ja) 번역을 채운다.
 * 영어(en)·기술명·plain string(name, liveLabel, period)은 건드리지 않음.
 * 멱등성: 다시 돌려도 같은 ja 로 덮어쓸 뿐이라 안전.
 *
 * 사용법: npx tsx scripts/translate-ja.ts
 */
import { config } from "dotenv"
import { MongoClient } from "mongodb"

config({ path: ".env" })

type I18n = { ko?: string | null; ja?: string | null; en?: string | null }
const setJa = (f: I18n | undefined | null, ja?: string) => {
  if (f && ja) f.ja = ja
  return f
}

async function main() {
  const uri = process.env.MONGODB_URI
  if (!uri) { console.error("✗ MONGODB_URI 없음"); process.exit(1) }
  const client = await new MongoClient(uri).connect()
  const db = client.db(process.env.MONGODB_DB ?? "portfolio")

  // ── HERO ──────────────────────────────
  {
    const c = db.collection("hero")
    const d = await c.findOne({ slug: "main" })
    if (d) {
      setJa(d.focus, "Web × AI")
      setJa(d.location, "韓国・牙山市")
      setJa(d.metaLeft, "ポートフォリオ · 2026 · 開発者")
      setJa(d.tagline, "AIとWebをつなぎ、新しい価値を生み出す開発者。")
      await c.updateOne({ _id: d._id }, { $set: { focus: d.focus, location: d.location, metaLeft: d.metaLeft, tagline: d.tagline } })
      console.log("· hero")
    }
  }

  // ── ABOUT ─────────────────────────────
  {
    const c = db.collection("about")
    const d = await c.findOne({ slug: "main" })
    if (d) {
      setJa(d.heading, "プログラムではなく、*サービス*を形にする開発者")
      const paraJa = [
        "生年月日 : 2003. 03. 10\n趣味 : 運動（ウェイト）\n目標 : アイデアが浮かんだら、すぐに実行できる開発者になること\n仕事で最も大切にしていること : コミュニケーション",
        "趣味 : 運動（ウェイト）",
        "目標 : アイデアが浮かんだら、すぐに実行できる開発者になること",
        "仕事で最も大切にしていること : コミュニケーション",
        "人と対話し、互いの考えを共有することが好きです。\n特に、さまざまなアイデアに耳を傾け、一緒に問題を解決していく過程に楽しさを感じます。\n新しい挑戦を楽しみ、問題を最後までやり遂げる粘り強さを基盤に、着実に成長しています。",
      ]
      if (Array.isArray(d.paragraphs)) d.paragraphs.forEach((p: I18n, i: number) => setJa(p, paraJa[i]))
      await c.updateOne({ _id: d._id }, { $set: { heading: d.heading, paragraphs: d.paragraphs } })
      console.log("· about")
    }
  }

  // ── WORKS ─────────────────────────────
  type WU = {
    match: Record<string, unknown>
    title?: string; tagline?: string; description?: string
    sections?: { title?: string; body?: string }[] // by index
  }
  const workUpdates: WU[] = [
    {
      match: { slug: "local-commerce-ai" },
      title: "ローカルコマースプラットフォームAIシステム（進行中）",
      tagline: "観光バウチャー事業のAI機能開発（韓国企業からの依頼）",
      description: "観光関連のAI機能開発を担当。AI統合フルスタック開発の2つ目の実績。",
      sections: [
        { title: "プロジェクト紹介", body: "既存のローカルコマースショッピングモールに、AIベースの旅行先レコメンドと位置情報ベースの商品レコメンド機能を組み合わせたAIローカルコマースプラットフォームです。\nまた、ユーザーの現在地、旅行テーマ、性別、年齢層、行動データを活用して最適な旅行先を提案し、提案した旅行先周辺の体験・宿泊・マーケット商品を併せて表示することで、旅行の探索が商品購入につながるように実装しました。" },
        { title: "担当した役割", body: "· GPSベースの現在地および検索地域を中心とした地図探索機能の実装\n· 観光地、飲食店、宿泊施設、アクティビティ、マーケット商品などのローカル情報を地図に統合表示\n· 性別、年齢層、地域、旅行テーマに基づくAI旅行先レコメンド機能の実装\n· おすすめ旅行先周辺のショッピングモール商品を併せて表示する商品プロモーション構造の開発\n· 現在地の半径内の体験・宿泊・マーケット商品レコメンド機能の実装\n· 位置の近接度、リアルタイム人気度、ユーザー嗜好の類似度に基づくレコメンドスコアリングロジックの設計\n· 協調フィルタリングベースのパーソナライズドレコメンド構造の開発\n· GBDT/LightGBMベースのMLランキングモデル学習パイプラインの構築\n· ユーザー行動イベントを活用した嗜好プロファイリング構造の設計\n· おすすめ商品の表示・クリック・購入転換の分析のためのイベント収集構造の実装\n· レコメンド経由の商品遷移および購入転換のトラッキングのためのパラメータ構造の設計\n· デスクトップとモバイル環境を考慮したレスポンシブ地図UIの実装" },
        { title: "主な成果", body: "既存のショッピングモールの商品羅列中心の構造を、ユーザーの位置と旅行目的に合わせて商品をレコメンドするAIコマース構造へと拡張しました。\n単に商品をレコメンドするのではなく、まずユーザーの旅行目的に合った旅行先を提案し、その旅行先周辺の商品を併せてプロモーションすることで、観光の探索と商品購入が自然につながるよう設計しました。\nまた、おすすめ商品の表示とクリックデータを収集する構造を整え、今後の協調フィルタリングやMLランキングモデルの学習データとして活用できるようにしました。これにより、レコメンド品質を継続的に改善し、購入転換率を分析できる基盤を構築しました。" },
        { title: "技術スタック", body: "· Frontend: Next.js, TypeScript, React, styled-components\n· Backend/API: FastAPI, Java Spring 連携\n· Database: MongoDB, MySQL\n· Map/Location: Kakao Map API, 現在地ベースのサービス\n· ML/Recommendation: Python, 協調フィルタリング, コンテンツベースフィルタリング, 埋め込みベースの類似度計算, GBDT/LightGBM Ranking" },
      ],
    },
    {
      match: { slug: "us-taekwondo" },
      title: "アメリカ・テコンドー道場管理SaaSプラットフォーム（進行中）",
      tagline: "道場の運営管理業務をWebベースで統合するためのSaaSプラットフォームの初期企画・設計段階（アメリカ企業からの依頼）",
      description: "アメリカのテコンドー道場運営全般を扱うSaaSを、アメリカ企業との協業で設計・実装中。",
      sections: [
        { title: "プロジェクト紹介", body: "武道場の運営管理業務をWebベースに移行するための道場管理SaaSプラットフォームの企画プロジェクトです。\n会員情報、出席、受講料、契約、昇級、イベントなど、道場運営に必要な主要業務を一つのシステムで管理し、会員自身も自分の出席状況や受講情報などを直接確認できる構造を目指しています。\n\n現在は初回ミーティングを経て初期設計段階であり、ユースケースとダイアグラムをHTMLベースのドキュメントとして作成しながら、サービスの流れと画面構造を整理しています。" },
        { title: "主な成果", body: "初回ミーティングを通じて、道場運営で繰り返し発生する管理業務を主要な課題領域として定義しました。\n会員管理、出席管理、受講料管理、契約管理の機能を優先的に扱うコア機能として整理し、それを基に要求仕様書を作成しました。\n\nまた、管理者と会員が使用する機能を分離し、管理者は運営業務を効率的に処理でき、会員は自分の情報を直接確認できるサービスの方向性を策定しました。\n現在は要求仕様書、ユースケース、ダイアグラムをHTMLで作成しながら、今後のMVP制作に向けた機能範囲とユーザー役割の構造を整理しています。" },
        { title: "技術スタック（未定）", body: "· Frontend: Next.js, TypeScript, React\n· Backend/API: Next.js API Route または別途のバックエンド構成\n· Database: Supabase\n· Auth/Permission: ロールベースの権限管理構造\n· Documentation: HTMLベースのユースケースおよびダイアグラム作成\n· UI/UX: 管理者ダッシュボード、会員ポータル、モバイル対応画面の企画\n· Future Features: QR出席, レポート, 通知, 契約管理, オンラインクラス" },
      ],
    },
    {
      match: { slug: "aisports" },
      title: "AIsports 縄跳び大会システム",
      tagline: "AI審判を導入した縄跳びのオン・オフライン大会 ― ランキング・管理者ダッシュボードを担当（web）",
      description: "プロジェクト紹介\nAISPORTは、AIベースの映像分析技術を活用して、スポーツ競技の動作を自動で評価・採点できるスポーツ大会運営プラットフォームです。\n選手はモバイルアプリケーションを通じて競技映像を提出でき、AIモデルがアップロードされた映像を分析してスコアと評価結果を生成します。生成された結果はデータベースに保存され、管理者ダッシュボードとランキングシステムから照会できます。\nまた、参加申込、選手管理、大会運営、記録管理、結果照会の機能を統合的に提供することで、スポーツ大会運営全般をデジタル化し、客観的で効率的な評価環境を提供することを目指すSaaSプラットフォームです。\n\n担当した役割\n· Next.jsベースのWebサービス開発\n· 管理者システムおよび大会運営機能の実装\n· 参加申込プロセスの改善および申込管理機能の開発\n· 大会・サービス紹介の詳細ページ開発\n· AI判定結果の照会およびランキングシステムの開発\n· Javaバックエンドロジックの改善によるデータ処理パイプラインの最適化\n\n主な貢献\n従来のシステムは、バックエンドサーバーがMongoDBとAIサーバーへ同時にデータを送り、AIサーバーが採点結果を再びMongoDBに保存する構造でした。\nJavaバックエンドのデータ処理ロジックを改善し、バックエンドサーバーはAIサーバーにのみデータを渡すように変更しました。その後、AIサーバーが分析結果とともにMongoDBへ保存する単一のデータフロー構造を構築しました。\nこれにより、データ保存経路の重複を排除し、データ処理構造を簡素化することで、システムの保守性とデータの整合性を向上させました。\n\n技術スタック\n· Frontend: Next.js, TypeScript\n· Backend: Java\n· Database: MongoDB\n· AI/ML: Machine Learning Scoring System",
      sections: [
        { title: "プロジェクト紹介", body: "AISPORTは、AIベースの映像分析技術を活用して、スポーツ競技の動作を自動で評価・採点できるスポーツ大会運営プラットフォームです。\n選手はモバイルアプリケーションを通じて競技映像を提出でき、AIモデルがアップロードされた映像を分析してスコアと評価結果を生成します。生成された結果はデータベースに保存され、管理者ダッシュボードとランキングシステムから照会できます。\nまた、参加申込、選手管理、大会運営、記録管理、結果照会の機能を統合的に提供することで、スポーツ大会運営全般をデジタル化し、客観的で効率的な評価環境を提供することを目指すSaaSプラットフォームです。" },
        { title: "担当した役割", body: "· Next.jsベースのWebサービス開発\n· 管理者システムおよび大会運営機能の実装\n· 参加申込プロセスの改善および申込管理機能の開発\n· 大会・サービス紹介の詳細ページ開発\n· AI判定結果の照会およびランキングシステムの開発\n· Javaバックエンドロジックの改善によるデータ処理パイプラインの最適化" },
        { title: "主な貢献", body: "従来のシステムは、バックエンドサーバーがMongoDBとAIサーバーへ同時にデータを送り、AIサーバーが採点結果を再びMongoDBに保存する構造でした。\nJavaバックエンドのデータ処理ロジックを改善し、バックエンドサーバーはAIサーバーにのみデータを渡すように変更しました。その後、AIサーバーが分析結果とともにMongoDBへ保存する単一のデータフロー構造を構築しました。\nこれにより、データ保存経路の重複を排除し、データ処理構造を簡素化することで、システムの保守性とデータの整合性を向上させました。\n" },
        { title: "技術スタック", body: "· Frontend: Next.js, TypeScript\n· Backend: Next.js API Routes, Java\n· Database: MongoDB" },
      ],
    },
    {
      match: { title: { $exists: true }, "title.ko": "안면 인식 출석 시스템" },
      title: "顔認識出席システム",
      tagline: "AIsports大会への適用を予定していたが、見送りとなったプロジェクト。",
      sections: [
        { title: "プロジェクト紹介", body: "AISports顔認識出席システムは、スポーツ大会の現場で参加者の本人確認と出席チェックを顔認識で自動化する現場運営システムです。\nカメラがリアルタイムでフレームをキャプチャして参加者の顔を認識し、事前に登録された顔プロフィールと照合して本人かどうかを判別します。認識が難しい状況に備え、運営者がタブレット・モバイルから直接出席を確定できる手動検証パネルも併せて提供します。\n参加者登録、顔データ収集の同意管理、顔プロフィール管理、出席履歴の照会まで管理者ダッシュボードで統合的に運用でき、手作業での名簿確認を置き換え、大会現場の出席手続きをデジタル化することを目指します。" },
        { title: "単独プロジェクト", body: "- Next.jsベースの出席システムWebサービス開発\n- リアルタイムカメラフレームに基づく顔認識チェックインフローの実装\n- 運営者向け手動検証パネル（モバイル・タブレット）の開発\n- 参加者・顔プロフィール・出席履歴の管理者ダッシュボードの実装\n- 顔データ収集の同意管理および個人情報処理フローの設計\n- セッション認証・CSRF・レート制限（rate limiting）などのセキュリティ機能の実装" },
        { title: "主な成果", body: "顔認識の信頼性と個人情報保護を同時に確保することに注力しました。\n参加者1人あたり最大3枚の顔サンプルを登録して認識精度を高め、マッチングのしきい値（threshold）を調整可能に設計することで、現場の照明・角度などの環境変化に対応しました。すでに出席処理された参加者の重複認識を防ぐロジックを設け、出席データの整合性を保証しました。\nまた、顔データの収集を**同意記録と連携**させ、同意のない生体情報が収集されないようにし、管理者ログイン・チェックインのリクエストにrate limitingとCSRF保護を適用しました。さらに、セキュリティ回帰テスト（`npm run test:security`）を備え、機能変更時にもセキュリティ要件が維持されているかを自動検証するようにしました。" },
        { body: "## 技術スタック\n\n- Frontend: Next.js, TypeScript\n- Backend: Next.js API Routes\n- Database: MongoDB (Mongoose)\n- Face Recognition: CompreFace\n- Validation: Zod" },
      ],
    },
    {
      match: { slug: "department-board" },
      title: "学科電子掲示板",
      tagline: "Webベースの学科デジタル掲示板プラットフォーム ― 個人開発",
      description: "Next.js + Supabase。管理者ページで作成したコンテンツが学内ディスプレイへ自動送信。",
      sections: [
        { title: "プロジェクト紹介", body: "学科電子掲示板プロジェクトは、学科およびキャンパスのお知らせをデジタルスライドの形で制作・管理し、実際のTV画面に自動再生できるように実装したWebベースのデジタル掲示板プラットフォームです。\n管理者はWeb管理者ページでお知らせスライドを作成・編集・削除し、表示順序と掲載期間を設定でき、ラズベリーパイをTVに接続して電光掲示板モードで常時運用できるように構成しました。\nまた、スライドごとのQRリンクとモバイル専用ページを提供し、TV画面を見ているユーザーがモバイルでも個別のお知らせ内容を確認できるように実装しました。" },
        { title: "単独プロジェクト", body: "· Next.jsベースのWebサービス全体の開発\n· 管理者ログインおよびJWTベースのセッション認証機能の実装\n· スライドの作成・編集・削除およびDrag & Drop並び替え機能の開発\n· スライドのタイトル、表示時間、公開可否、開始/終了予約の設定機能の実装\n· React KonvaベースのTV/モバイル分離型キャンバスエディタの開発\n· テキスト、画像、QRオブジェクトの追加・編集機能の実装\n· Supabase DBおよびStorageの連携\n· 画像のアップロード、リサイズ、圧縮処理機能の実装\n· TV画面の自動再生およびスライド切り替えロジックの実装\n· 画像のプリロードおよびローカルキャッシュを活用した再生の安定化\n· ラズベリーパイ環境のセットアップおよび実機TVへの接続\n· ブラウザ電光掲示板モード設定による常時ディスプレイ運用の構成" },
        { title: "主な貢献", body: "従来の静的な画像掲載方式や手動でのファイル差し替え方式の不便さを改善するため、管理者がWeb上で直接お知らせスライドを制作・運用できるデジタル掲示板システムを実装しました。\nReact Konvaベースのキャンバスエディタを開発し、テキスト・画像・QRオブジェクトを自由に配置できるようにし、TV画面用スライドとモバイル画面用スライドを分けて編集できる構造を適用しました。これにより、電光掲示板に表示される画面とモバイルで確認する画面を、それぞれの環境に合わせて最適化できるようにしました。\nスライドごとの公開可否、表示時間、掲載開始/終了時刻を設定できる予約掲載機能を実装し、実際の学校掲示板の運用環境に必要な管理機能を提供しました。また、Drag & Dropベースの並び替え機能を適用し、管理者が容易にスライドの表示順序を変更できるように改善しました。\nTVプレイヤーは、Supabase Viewのデータを基準に掲載可能なスライドを自動で照会し、循環再生するように実装しました。画像のプリロードとローカルキャッシュを適用し、ネットワーク遅延や一時的なデータ照会の失敗時にも画面が安定して維持されるようにしました。\nさらに、ラズベリーパイを自ら設定してTVに接続し、ブラウザを電光掲示板モードで実行する実運用環境を構成しました。これにより、開発したWebサービスが単なる画面実装にとどまらず、実際のディスプレイ機器で常時運用可能な形で動作するよう完成させました。" },
        { title: "技術スタック", body: "· Frontend: Next.js, React, TypeScript, Tailwind CSS\n· Canvas: React Konva, Konva\n· Backend/API: Next.js API Routes\n· Database: Supabase\n· Storage: Supabase Storage\n· Device: Raspberry Pi, TV Display\n· Auth: JWT, HttpOnly Cookie\n· Image Processing: Sharp" },
      ],
    },
    {
      match: { slug: "shop-nextjs" },
      title: "ショッピングモール",
      tagline: "Next.jsベースのショッピングモール — カート・決済・管理者",
      description: "Next.js 14 App Routerで作成したショッピングモールの練習作。",
      sections: [{ body: "Next.js 14 App Routerで作成したショッピングモールの練習作。" }],
    },
    {
      match: { slug: "voca-react" },
      title: "単語暗記アプリ",
      tagline: "単語暗記Webアプリ — カードインタラクション・ローカル状態",
      description: "Reactで作成した単語暗記の学習ツール。",
      sections: [{ body: "Reactで作成した単語暗記の学習ツール。" }],
    },
    {
      match: { slug: "todolist-nextjs" },
      title: "Todoリスト",
      tagline: "Next.jsフルスタックTodo — CRUD・ルーティングの基礎固め",
      description: "Next.jsフルスタックTodoリストの練習作。",
      sections: [{ body: "Next.jsフルスタックTodoリストの練習作。" }],
    },
  ]

  {
    const c = db.collection("works")
    for (const u of workUpdates) {
      const d = await c.findOne(u.match)
      if (!d) { console.log(`· works ✗ not found: ${JSON.stringify(u.match)}`); continue }
      setJa(d.title, u.title)
      setJa(d.tagline, u.tagline)
      setJa(d.description, u.description)
      if (u.sections && Array.isArray(d.sections)) {
        d.sections.forEach((sec: { title?: I18n; body?: I18n }, i: number) => {
          const spec = u.sections![i]
          if (!spec) return
          setJa(sec.title, spec.title)
          setJa(sec.body, spec.body)
        })
      }
      await c.updateOne({ _id: d._id }, { $set: { title: d.title, tagline: d.tagline, description: d.description, sections: d.sections } })
      console.log(`· works/${d.title?.ko}`)
    }
  }

  // ── EDUCATION ─────────────────────────
  {
    const c = db.collection("education")
    const eduUpdates = [
      { match: { slug: "edu-1" }, schoolName: "Sun Moon University", major: "コンピュータ工学部コンピュータ工学科専攻 / 日本語専攻（ダブルメジャー）" },
      { match: { slug: "edu-2" }, schoolName: "タンジン高等学校", major: "卒業" },
    ]
    for (const u of eduUpdates) {
      const d = await c.findOne(u.match)
      if (!d) { console.log(`· education ✗ ${JSON.stringify(u.match)}`); continue }
      setJa(d.schoolName, u.schoolName)
      setJa(d.major, u.major)
      await c.updateOne({ _id: d._id }, { $set: { schoolName: d.schoolName, major: d.major } })
      console.log(`· education/${d.schoolName?.ko}`)
    }
  }

  // ── EXPERIENCE ────────────────────────
  {
    const c = db.collection("experience")
    const expUpdates = [
      { match: { slug: "exp-1" }, title: "DNSLAB研究室所属", orgName: "大学の学部研究生" },
      { match: { slug: "exp-2" }, title: "スターバックス バリスタ勤務" },
      { match: { slug: "exp-3" }, title: "兵役（軍服務）" },
      { match: { "title.ko": "청년창업해커톤 우수상 수상" }, title: "青年起業ハッカソン 優秀賞受賞", orgName: "大韓建築士協会 主催の大会", description: "Arduinoを用いた共有キックボードの安全装置で優秀賞を受賞しました。" },
      { match: { "title.ko": "편의점 아르바이트 경력" }, title: "コンビニ アルバイト経験" },
      { match: { "title.ko": "패스트푸드(LotteRia) 아르바이트 경력" }, title: "ファストフード（ロッテリア）アルバイト経験" },
    ]
    for (const u of expUpdates) {
      const d = await c.findOne(u.match)
      if (!d) { console.log(`· experience ✗ ${JSON.stringify(u.match)}`); continue }
      setJa(d.title, u.title)
      setJa(d.orgName, (u as { orgName?: string }).orgName)
      setJa(d.description, (u as { description?: string }).description)
      await c.updateOne({ _id: d._id }, { $set: { title: d.title, orgName: d.orgName, description: d.description } })
      console.log(`· experience/${d.title?.ko}`)
    }
  }

  // ── SKILLS (level only) ───────────────
  {
    const c = db.collection("skills")
    const levelJa: Record<string, string> = { "실무": "実務レベル", "능숙": "得意分野", "취미": "趣味" }
    const docs = await c.find({}).toArray()
    for (const d of docs) {
      const lv = d.level as I18n | undefined
      if (lv?.ko && levelJa[lv.ko]) {
        lv.ja = levelJa[lv.ko]
        await c.updateOne({ _id: d._id }, { $set: { level: lv } })
        console.log(`· skills/${d.name} (${lv.ko}→${lv.ja})`)
      }
    }
  }

  // ── SETTINGS ──────────────────────────
  {
    const c = db.collection("settings")
    const d = await c.findOne({ slug: "main" })
    if (d) {
      setJa(d.metaDescription, "Next.jsでフルスタックWebを作り、そこにAIを組み込む開発者。")
      await c.updateOne({ _id: d._id }, { $set: { metaDescription: d.metaDescription, enabledLanguages: ["ko", "ja"] } })
      console.log("· settings (enabledLanguages=[ko,ja])")
    }
  }

  console.log("\n✓ 일본어 번역 채우기 완료.")
  await client.close()
}

main().catch((e) => { console.error(e); process.exit(1) })
