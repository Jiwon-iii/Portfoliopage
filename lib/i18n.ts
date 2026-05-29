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
  // 메뉴
  menuWork: { ko: "작업", ja: "作品", en: "Work" },
  menuAbout: { ko: "소개", ja: "紹介", en: "About" },
  menuContact: { ko: "연락", ja: "連絡", en: "Contact" },

  // 섹션 제목
  sectionFeatured: { ko: "영웅 프로젝트", ja: "主な作品", en: "Featured Work" },
  sectionFeaturedSub: { ko: "대표 프로젝트 한 가지", ja: "代表プロジェクト", en: "Selected case" },
  sectionOther: { ko: "그 외 작업", ja: "その他の作品", en: "Other Works" },
  sectionOtherSub: { ko: "기타 프로젝트", ja: "他のプロジェクト", en: "Other projects" },
  sectionBuilding: { ko: "진행 중", ja: "進行中", en: "Currently Building" },
  sectionBuildingSub: { ko: "지금 만들고 있는 것", ja: "今作っているもの", en: "Now building" },
  sectionProjects: { ko: "프로젝트", ja: "プロジェクト", en: "Projects" },
  sectionProjectsSub: { ko: "모든 프로젝트 상세", ja: "全プロジェクト詳細", en: "All projects in detail" },
  sectionPractice: { ko: "그 외 프로젝트", ja: "その他のプロジェクト", en: "Other Projects" },
  sectionPracticeSub: { ko: "연습 작업물", ja: "練習作", en: "Practice works" },
  sectionAbout: { ko: "소개", ja: "紹介", en: "About" },
  sectionAboutSub: { ko: "Who I Am", ja: "Who I Am", en: "Who I Am" },
  sectionEducation: { ko: "학력", ja: "学歴", en: "Education" },
  sectionEducationSub: { ko: "교육 배경", ja: "教育背景", en: "Academic background" },
  sectionExperience: { ko: "경력 · 활동", ja: "経歴", en: "Experience" },
  sectionExperienceSub: { ko: "일·동아리·공모전", ja: "仕事・サークル・コンテスト", en: "Work, clubs, contests" },
  sectionSkills: { ko: "사용 기술", ja: "技術", en: "Skills" },
  sectionContact: { ko: "연락", ja: "連絡", en: "Contact" },

  // 라벨
  problem: { ko: "문제", ja: "課題", en: "Problem" },
  approach: { ko: "접근", ja: "解決", en: "Approach" },
  outcome: { ko: "결과", ja: "結果", en: "Outcome" },
  description: { ko: "설명", ja: "説明", en: "Description" },
  inProgress: { ko: "진행 중", ja: "進行中", en: "In Progress" },
  openToWork: { ko: "구직 중", ja: "就職活動中", en: "Open to work" },
  basedIn: { ko: "거점", ja: "拠点", en: "Based in" },
  focus: { ko: "분야", ja: "分野", en: "Focus" },
  stack: { ko: "스택", ja: "スタック", en: "Stack" },
  status: { ko: "상태", ja: "状態", en: "Status" },
  heroIntro: { ko: "— 한 줄 소개", ja: "— 自己紹介", en: "— Intro" },
  skillMain: { ko: "주력 스택", ja: "主力スタック", en: "Core Stack" },
  skillUsable: { ko: "활용 가능 스택", ja: "使用可能スタック", en: "Working Knowledge" },

  // 액션
  viewMore: { ko: "자세히 보기", ja: "詳しく見る", en: "View case study" },
  viewGithub: { ko: "깃허브", ja: "GitHub", en: "GitHub" },
  letsWork: { ko: "같이 일해요?", ja: "一緒に作りましょう", en: "Let's work?" },
  scrollMore: { ko: "스크롤하여 더 보기", ja: "スクロールで詳細", en: "Scroll to explore" },

  // 메뉴(섹션 번호 옆)
  menuWorkNum: { ko: "작업", ja: "作品", en: "Work" },

  // 연락 섹션
  contactLead: { ko: "함께", ja: "一緒に", en: "Let's" },
  contactEm: { ko: "만들어봐요", ja: "作りましょう", en: "build it" },
  contactGithub: { ko: "→ 깃허브 / JIWON-III", ja: "→ GitHub / JIWON-III", en: "→ GitHub / JIWON-III" },
  contactNaver: { ko: "→ 네이버 메일", ja: "→ Naverメール", en: "→ Naver mail" },

  // 빈 상태
  emptyWorks: { ko: "아직 작업이 추가되지 않았어요", ja: "作品はまだありません", en: "No works yet" },
  emptyAbout: { ko: "소개 콘텐츠를 어드민에서 입력해주세요", ja: "プロフィールを管理画面で入力", en: "Add about info from admin" },
  emptyEducation: { ko: "학력 정보가 아직 추가되지 않았어요.", ja: "学歴情報はまだありません。", en: "No education added yet." },
  emptyExperience: { ko: "경력 정보가 아직 추가되지 않았어요.", ja: "経歴情報はまだありません。", en: "No experience added yet." },
  emptySkills: { ko: "기술 항목이 아직 추가되지 않았어요.", ja: "技術項目はまだありません。", en: "No skills added yet." },
} as const

export type LabelKey = keyof typeof labels

export function label(key: LabelKey, lang: Lang): string {
  const entry = labels[key]
  return entry[lang] || entry.ko
}
