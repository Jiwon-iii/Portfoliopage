import { AdminNavbar } from "@/components/admin/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { listWorks } from "@/lib/repo/works"
import { listEducation } from "@/lib/repo/education"
import { listExperience } from "@/lib/repo/experience"
import { listSkills } from "@/lib/repo/skills"
import { getHero } from "@/lib/repo/hero"
import { getAbout } from "@/lib/repo/about"
import Link from "next/link"
import { ArrowRight, Star, List, Play, User, GraduationCap, Briefcase, Code2, Home } from "lucide-react"

export const dynamic = "force-dynamic"

async function getStats() {
  try {
    const [works, education, experience, skills, hero, about] = await Promise.all([
      listWorks({ publishedOnly: false }),
      listEducation(false),
      listExperience(false),
      listSkills(),
      getHero(),
      getAbout(),
    ])
    return {
      featured: works.filter((w) => w.type === "featured").length,
      other: works.filter((w) => w.type === "other").length,
      building: works.filter((w) => w.type === "building").length,
      education: education.length,
      experience: experience.length,
      skills: skills.length,
      hasHero: !!hero,
      hasAbout: !!about,
      dbReady: true,
    }
  } catch {
    return {
      featured: 0, other: 0, building: 0, education: 0, experience: 0, skills: 0,
      hasHero: false, hasAbout: false, dbReady: false,
    }
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const tiles = [
    { href: "/admin/hero", label: "Hero", icon: Home, count: stats.hasHero ? 1 : 0, total: 1 },
    { href: "/admin/works?type=featured", label: "Featured", icon: Star, count: stats.featured, total: 1 },
    { href: "/admin/works", label: "Other Works", icon: List, count: stats.other, total: null },
    { href: "/admin/works?type=building", label: "Currently Building", icon: Play, count: stats.building, total: null },
    { href: "/admin/about", label: "About", icon: User, count: stats.hasAbout ? 1 : 0, total: 1 },
    { href: "/admin/education", label: "Education", icon: GraduationCap, count: stats.education, total: null },
    { href: "/admin/experience", label: "Experience", icon: Briefcase, count: stats.experience, total: null },
    { href: "/admin/skills", label: "Skills", icon: Code2, count: stats.skills, total: null },
  ]

  return (
    <>
      <AdminNavbar title="Dashboard" />
      <main className="max-w-7xl mx-auto px-8 py-8">
        {!stats.dbReady && (
          <Card className="mb-6 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle className="text-amber-900 dark:text-amber-200">데이터베이스에 연결할 수 없습니다</CardTitle>
              <CardDescription className="text-amber-800 dark:text-amber-300">
                잠시 후 페이지를 새로고침해 주세요.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <div className="mb-8">
          <p className="text-muted-foreground">콘텐츠 카테고리를 골라서 추가·수정·삭제하세요.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiles.map((tile) => {
            const Icon = tile.icon
            return (
              <Link key={tile.href} href={tile.href}>
                <Card className="transition-colors hover:border-primary cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-sm font-medium pt-2">{tile.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="font-serif text-3xl font-extrabold">
                      {tile.count}
                      {tile.total !== null && (
                        <span className="text-muted-foreground text-base font-normal"> / {tile.total}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-base">출시 체크리스트</CardTitle>
            <CardDescription>V1 출시 전 확인할 항목</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className={stats.hasHero ? "text-emerald-600" : "text-muted-foreground"}>
                  {stats.hasHero ? "✓" : "○"}
                </span>
                Hero 콘텐츠 (이름·태그라인·연락처)
              </li>
              <li className="flex gap-2">
                <span className={stats.featured >= 1 ? "text-emerald-600" : "text-muted-foreground"}>
                  {stats.featured >= 1 ? "✓" : "○"}
                </span>
                Featured 영웅 프로젝트 1개
              </li>
              <li className="flex gap-2">
                <span className={stats.other >= 3 ? "text-emerald-600" : "text-muted-foreground"}>
                  {stats.other >= 3 ? "✓" : "○"}
                </span>
                Other Works 3개 이상
              </li>
              <li className="flex gap-2">
                <span className={stats.hasAbout ? "text-emerald-600" : "text-muted-foreground"}>
                  {stats.hasAbout ? "✓" : "○"}
                </span>
                About 자기소개
              </li>
              <li className="flex gap-2">
                <span className={stats.education >= 1 ? "text-emerald-600" : "text-muted-foreground"}>
                  {stats.education >= 1 ? "✓" : "○"}
                </span>
                학력 항목
              </li>
              <li className="flex gap-2">
                <span className={stats.skills >= 5 ? "text-emerald-600" : "text-muted-foreground"}>
                  {stats.skills >= 5 ? "✓" : "○"}
                </span>
                Skills 5개 이상
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
