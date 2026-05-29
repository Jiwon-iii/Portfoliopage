import { listWorks } from "@/lib/repo/works"
import { listEducation } from "@/lib/repo/education"
import { listExperience } from "@/lib/repo/experience"
import { listSkillsByCategory } from "@/lib/repo/skills"
import { getHero } from "@/lib/repo/hero"
import { getAbout } from "@/lib/repo/about"

import { HeroSection } from "@/components/site/hero"
import { Marquee } from "@/components/site/marquee"
import { ProjectsSection } from "@/components/site/projects"
import { PracticeSection } from "@/components/site/practice"
import { AboutSection } from "@/components/site/about"
import { TimelineSection } from "@/components/site/timeline"
import { SkillsSection } from "@/components/site/skills"
import { ContactSection } from "@/components/site/contact"

/** ISR — 어드민에서 revalidatePath() 호출 시 즉시 갱신. */
export const revalidate = 3600

async function loadAll() {
  try {
    const [allWorks, education, experience, skillsByCat, hero, about] = await Promise.all([
      listWorks(),
      listEducation(),
      listExperience(),
      listSkillsByCategory(),
      getHero(),
      getAbout(),
    ])
    // 프로젝트 = 일반(general). 진행 상태(status)는 카드 안에서 배지로 자동 구분.
    return {
      projects: allWorks.filter((w) => w.type === "general"),
      practice: allWorks.filter((w) => w.type === "practice"),
      education,
      experience,
      skillsByCat,
      hero,
      about,
      ok: true,
    }
  } catch (err) {
    console.error("[home] DB 연결 실패:", err)
    return {
      projects: [],
      practice: [],
      education: [],
      experience: [],
      skillsByCat: { main: [], usable: [] },
      hero: null,
      about: null,
      ok: false,
    }
  }
}

export default async function HomePage() {
  const data = await loadAll()
  const lang = "ko" as const

  return (
    <main>
      <HeroSection hero={data.hero} lang={lang} />
      <Marquee items={data.hero?.marqueeItems} />
      <ProjectsSection works={data.projects} lang={lang} />
      <PracticeSection works={data.practice} lang={lang} />
      <AboutSection about={data.about} lang={lang} />
      <TimelineSection
        num="04"
        totalNum="07"
        title="학력"
        subtitle="교육 배경"
        aside={<>ACADEMIC BACKGROUND</>}
        items={data.education.map((e) => ({
          _id: e._id,
          period: e.period,
          title: e.schoolName,
          where: e.major,
          note: e.note,
        }))}
        lang={lang}
        emptyMessage="학력 정보가 아직 추가되지 않았어요."
      />
      <TimelineSection
        num="05"
        totalNum="07"
        numPosition="left"
        title="경력 · 활동"
        subtitle="일·동아리·공모전"
        aside={<>SELECTED ACTIVITIES</>}
        items={data.experience.map((e) => ({
          _id: e._id,
          period: e.period,
          title: e.title,
          where: e.orgName,
          note: e.description,
        }))}
        lang={lang}
        emptyMessage="경력 정보가 아직 추가되지 않았어요."
      />
      <SkillsSection skills={data.skillsByCat} lang={lang} />
      <ContactSection hero={data.hero} />
    </main>
  )
}
