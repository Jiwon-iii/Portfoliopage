/**
 * 다국어 헬퍼 — UI 라벨 + 언어 선택 + 폴백.
 *
 * V1: KR only. JP/EN 토글은 자리만 잡혀있고 클릭 시 "준비 중" 알림 + KR 복귀.
 * V1.5: enabledLanguages 로 활성 언어 제어.
 */
import type { Lang } from "./schemas/i18n-field"
export { pickLang, type Lang, LANGS } from "./schemas/i18n-field"

/**
 * UI 라벨 사전. 어드민·메인 사이트의 정적 문구.
 * 새 라벨 추가 시: ko 필수, ja/en 비어두면 ko 폴백.
 */
export const labels = {
  // 사이트 메뉴 (메뉴별 페이지)
  home: { ko: "홈", ja: "ホーム", en: "Home" },
  navWorks: { ko: "프로젝트", ja: "プロジェクト", en: "Projects" },
  navAbout: { ko: "소개", ja: "私について", en: "About" },
  navExpertise: { ko: "분야", ja: "分野", en: "Areas" },
  menu: { ko: "메뉴", ja: "メニュー", en: "Menu" },
  all: { ko: "전체", ja: "全体", en: "All" },
  navProfile: { ko: "개요·연혁", ja: "概要・沿革", en: "Profile" },
  navContact: { ko: "문의", ja: "お問い合わせ", en: "Contact" },
  role: { ko: "풀스택 엔지니어", ja: "フルスタックエンジニア", en: "Full-stack Engineer" },
  ctaContact: { ko: "연락하기", ja: "連絡する", en: "Contact" },
  viewWorks: { ko: "프로젝트 보기", ja: "プロジェクトを見る", en: "View projects" },
  more: { ko: "자세히 보기", ja: "詳しく見る", en: "Learn more" },

  // 사이트 섹션
  newsTitle: { ko: "지금 하고 있는 일", ja: "現在の取り組み", en: "Now" },
  mission: { ko: "미션", ja: "ミッション", en: "Mission" },
  values: { ko: "소중히 하는 것", ja: "大切にしていること", en: "What I value" },
  message: { ko: "인사말", ja: "ごあいさつ", en: "Message" },
  overview: { ko: "개요", ja: "概要", en: "Overview" },
  history: { ko: "연혁", ja: "沿革", en: "History" },
  related: { ko: "관련 프로젝트", ja: "関連プロジェクト", en: "Related projects" },
  backToWorks: { ko: "프로젝트 목록으로", ja: "プロジェクト一覧へ戻る", en: "Back to projects" },
  worksLead: { ko: "기업 의뢰 프로젝트와, 팀·개인으로 개발한 프로젝트입니다.", ja: "企業からの依頼案件と、チーム・個人で開発したプロジェクトです。", en: "Client projects and projects built as a team or on my own." },
  expertiseLead: { ko: "지금까지 맡아 온 프로젝트를 분야별로 모았습니다.", ja: "これまで担当してきたプロジェクトを、分野ごとにまとめました。", en: "Projects I have worked on, grouped by area." },
  contactLead: { ko: "채용·인턴 연락, 그 밖의 상담은 메일로 편하게 보내 주세요.", ja: "採用・インターンのご連絡、その他のご相談はメールでお気軽にどうぞ。", en: "For hiring, internships or anything else, feel free to email me." },
  ctaTitle: { ko: "*함께 일할 기회*를\n찾고 있습니다.", ja: "*一緒に働ける機会*を\n探しています。", en: "Looking for *a chance\nto work together*." },
  ctaSub: { ko: "채용·인턴 연락, 그 밖의 상담은 메일로 보내 주세요.", ja: "採用・インターンのご連絡、その他のご相談はメールでどうぞ。", en: "Hiring, internships or other inquiries — just email me." },
  contactEmpty: { ko: "연락처를 준비하고 있습니다.", ja: "連絡先を準備しています。", en: "Contact details coming soon." },
  mailTitle: { ko: "메일로 연락하기", ja: "メールで連絡する", en: "Email me" },
  mailBody: { ko: "채용·인턴 연락을 비롯해, 프로젝트 관련 상담도 이쪽으로 보내 주세요.", ja: "採用・インターンのご連絡をはじめ、プロジェクトに関するご相談もこちらへお送りください。", en: "Hiring, internships and project inquiries all welcome." },
  mailSecondary: { ko: "보조 메일", ja: "サブアドレス", en: "Secondary" },
  githubTitle: { ko: "코드 보기", ja: "コードを見る", en: "See the code" },
  githubBody: { ko: "공개 저장소와 이 사이트의 소스 코드를 볼 수 있습니다.", ja: "公開しているリポジトリと、このサイトのソースコードをご覧いただけます。", en: "Public repositories, including this site's source code." },
  footerNote: { ko: "이 사이트는 Next.js와 MongoDB로 직접 만들었습니다", ja: "このサイトは Next.js と MongoDB で自作しています", en: "Built by me with Next.js and MongoDB" },

  // 숫자 띠 (어드민에 입력 전 기본값)
  statProjects: { ko: "제작 프로젝트", ja: "制作プロジェクト", en: "Projects" },
  statInProgress: { ko: "진행 중인 프로젝트", ja: "進行中のプロジェクト", en: "In progress" },
  statSkills: { ko: "다루는 기술", ja: "扱う技術", en: "Technologies" },
  unitCount: { ko: "개", ja: "件", en: "" },

  // 概要 표 · 실적 상세
  ovName: { ko: "이름", ja: "名称", en: "Name" },
  ovRole: { ko: "직무", ja: "職種", en: "Role" },
  ovLocation: { ko: "거점", ja: "所在地", en: "Location" },
  ovAffiliation: { ko: "소속", ja: "所属", en: "Affiliation" },
  ovAreas: { ko: "분야", ja: "分野", en: "Areas" },
  ovSkills: { ko: "주요 기술", ja: "主要技術", en: "Main stack" },
  ovContact: { ko: "연락처", ja: "連絡先", en: "Contact" },
  year: { ko: "연도", ja: "年", en: "Year" },
  techs: { ko: "기술", ja: "技術", en: "Stack" },
  completed: { ko: "완료", ja: "完了", en: "Completed" },

  // 섹션 제목
  sectionEducation: { ko: "학력", ja: "学歴", en: "Education" },
  sectionCerts: { ko: "자격·면허", ja: "資格・免許", en: "Licenses & Certifications" },
  skillsSum: { ko: "화면부터 API·DB·배포까지 경험하며, 요구사항을 실제 서비스로 구현해 왔습니다.", ja: "画面からAPI・DB・デプロイまで経験し、要件を実際のサービスとして実装してきました。", en: "From UI to APIs, databases and deployment, I have turned requirements into real services." },
  sectionSkills: { ko: "사용 기술", ja: "技術", en: "Skills" },

  // 라벨
  inProgress: { ko: "진행 중", ja: "進行中", en: "In Progress" },
  status: { ko: "상태", ja: "状態", en: "Status" },

  // 액션
  viewMore: { ko: "자세히 보기", ja: "詳しく見る", en: "View case study" },

  // 빈 상태
  emptyWorks: { ko: "아직 작업이 추가되지 않았어요", ja: "作品はまだありません", en: "No works yet" },
} as const

export type LabelKey = keyof typeof labels

export function label(key: LabelKey, lang: Lang): string {
  const entry = labels[key]
  return entry[lang] || entry.ko
}
