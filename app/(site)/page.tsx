import { listWorks } from "@/lib/repo/works"
import { listEducation } from "@/lib/repo/education"
import { listExperience } from "@/lib/repo/experience"
import { listSkillsByCategory } from "@/lib/repo/skills"
import { getHero } from "@/lib/repo/hero"
import { getAbout } from "@/lib/repo/about"
import { getSiteLang } from "@/lib/site-lang"
import { label } from "@/lib/i18n"

import { HeroSection } from "@/components/site/hero"
import { Marquee } from "@/components/site/marquee"
import { ProjectsSection } from "@/components/site/projects"
import { PracticeSection } from "@/components/site/practice"
import { AboutSection } from "@/components/site/about"
import { TimelineSection } from "@/components/site/timeline"
import { SkillsSection } from "@/components/site/skills"
import { ContactSection } from "@/components/site/contact"

/** 쿠키(lang)로 표시 언어가 갈리므로 요청마다 동적 렌더링. 어드민 수정도 즉시 반영. */
export const dynamic = "force-dynamic"

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
  const [data, { lang }] = await Promise.all([loadAll(), getSiteLang()])

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
        title={label("sectionEducation", lang)}
        subtitle={label("sectionEducationSub", lang)}
        aside={<>ACADEMIC BACKGROUND</>}
        items={data.education.map((e) => ({
          _id: e._id,
          period: e.period,
          title: e.schoolName,
          where: e.major,
          note: e.note,
        }))}
        lang={lang}
        emptyMessage={label("emptyEducation", lang)}
      />
      <TimelineSection
        num="05"
        totalNum="07"
        numPosition="left"
        title={label("sectionExperience", lang)}
        subtitle={label("sectionExperienceSub", lang)}
        aside={<>SELECTED ACTIVITIES</>}
        items={data.experience.map((e) => ({
          _id: e._id,
          period: e.period,
          title: e.title,
          where: e.orgName,
          note: e.description,
        }))}
        lang={lang}
        emptyMessage={label("emptyExperience", lang)}
      />
      <SkillsSection skills={data.skillsByCat} lang={lang} />
      <ContactSection hero={data.hero} lang={lang} />
    </main>
  )
}
