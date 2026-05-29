import { AdminNavbar } from "@/components/admin/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { listWorks } from "@/lib/repo/works"
import { listEducation } from "@/lib/repo/education"
import { listExperience } from "@/lib/repo/experience"
import { listSkills } from "@/lib/repo/skills"
import { getHero } from "@/lib/repo/hero"
import { getAbout } from "@/lib/repo/about"
import Link from "next/link"
import { ArrowRight, List, Layers, User, GraduationCap, Briefcase, Code2, Home, Plus } from "lucide-react"
import { pickLang } from "@/lib/i18n"

export const dynamic = "force-dynamic"

async function loadAll() {
  try {
    const [works, education, experience, skills, hero, about] = await Promise.all([
      listWorks({ publishedOnly: false }),
      listEducation(false),
      listExperience(false),
      listSkills(),
      getHero(),
      getAbout(),
    ])
    return { works, education, experience, skills, hero, about, dbReady: true }
  } catch {
    return {
      works: [],
      education: [],
      experience: [],
      skills: [],
      hero: null,
      about: null,
      dbReady: false,
    }
  }
}

function clip(s: string | undefined | null, max: number): string {
  if (!s) return ""
  const trimmed = s.trim()
  if (trimmed.length <= max) return trimmed
  return trimmed.slice(0, max).trim() + "…"
}

export default async function AdminDashboard() {
  const data = await loadAll()
  const lang = "ko" as const

  const general = data.works.filter((w) => w.type === "general")
  const practice = data.works.filter((w) => w.type === "practice")
  const inProgressCount = general.filter((w) => w.status === "in-progress").length

  return (
    <>
      <AdminNavbar title="대시보드" />
      <main className="max-w-7xl mx-auto px-8 py-8">
        {!data.dbReady && (
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
          <p className="text-muted-foreground">메뉴별 콘텐츠 미리보기. 클릭하면 해당 페이지로 이동합니다.</p>
        </div>

        {/* ── 콘텐츠 ───────────────────────── */}
        <h2 className="text-xs font-medium text-muted-foreground tracking-wider uppercase mb-3 px-1">콘텐츠</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* 대표 소개 */}
          <TileCard href="/admin/hero" icon={Home} label="대표 소개">
            {data.hero ? (
              <div className="space-y-1.5">
                <div className="font-serif text-lg font-bold leading-tight">{pickLang(data.hero.name, lang)}</div>
                <div className="text-xs text-muted-foreground line-clamp-2 leading-snug">
                  {clip(pickLang(data.hero.tagline, lang), 90) || "한 줄 소개 비어있음"}
                </div>
              </div>
            ) : (
              <EmptyHint text="아직 입력되지 않았어요" />
            )}
          </TileCard>

          {/* 일반 프로젝트 */}
          <TileCard
            href="/admin/works?type=general"
            icon={List}
            label="일반 프로젝트"
            count={general.length}
            hint={inProgressCount > 0 ? `진행 중 ${inProgressCount}개 포함` : undefined}
          >
            {general.length === 0 ? (
              <EmptyHint text="프로젝트 없음" />
            ) : (
              <ul className="space-y-1 text-sm">
                {general.slice(0, 5).map((w) => (
                  <li key={w._id} className="flex items-start gap-2">
                    <span
                      className={
                        "mt-1.5 w-1 h-1 rounded-full flex-shrink-0 " +
                        (w.status === "in-progress" ? "bg-primary animate-pulse" : "bg-muted-foreground/40")
                      }
                    />
                    <span className="truncate text-foreground">{pickLang(w.title, lang)}</span>
                  </li>
                ))}
                {general.length > 5 && (
                  <li className="text-xs text-muted-foreground pl-3 pt-0.5">+ {general.length - 5}개 더</li>
                )}
              </ul>
            )}
          </TileCard>

          {/* 연습 프로젝트 */}
          <TileCard
            href="/admin/works?type=practice"
            icon={Layers}
            label="연습 프로젝트"
            count={practice.length}
          >
            {practice.length === 0 ? (
              <EmptyHint text="연습 프로젝트 없음" />
            ) : (
              <ul className="space-y-1 text-sm">
                {practice.slice(0, 5).map((w) => (
                  <li key={w._id} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-muted-foreground/40 flex-shrink-0" />
                    <span className="truncate text-foreground">{pickLang(w.title, lang)}</span>
                  </li>
                ))}
                {practice.length > 5 && (
                  <li className="text-xs text-muted-foreground pl-3 pt-0.5">+ {practice.length - 5}개 더</li>
                )}
              </ul>
            )}
          </TileCard>
        </div>

        {/* ── 소개 ───────────────────────── */}
        <h2 className="text-xs font-medium text-muted-foreground tracking-wider uppercase mb-3 px-1">소개</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 자기소개 */}
          <TileCard href="/admin/about" icon={User} label="자기소개">
            {data.about ? (
              <div className="text-sm text-foreground line-clamp-3 leading-relaxed">
                {clip(pickLang(data.about.heading, lang), 160) ||
                  clip(pickLang(data.about.paragraphs?.[0], lang), 160) ||
                  "내용 비어있음"}
              </div>
            ) : (
              <EmptyHint text="아직 입력되지 않았어요" />
            )}
          </TileCard>

          {/* 학력 */}
          <TileCard href="/admin/education" icon={GraduationCap} label="학력" count={data.education.length}>
            {data.education.length === 0 ? (
              <EmptyHint text="학력 없음" />
            ) : (
              <ul className="space-y-1 text-sm">
                {data.education.slice(0, 3).map((e) => (
                  <li key={e._id} className="flex items-baseline gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground tracking-wider flex-shrink-0">
                      {e.period.end}
                    </span>
                    <span className="truncate text-foreground">{pickLang(e.schoolName, lang)}</span>
                  </li>
                ))}
                {data.education.length > 3 && (
                  <li className="text-xs text-muted-foreground pt-0.5">+ {data.education.length - 3}개 더</li>
                )}
              </ul>
            )}
          </TileCard>

          {/* 경력 */}
          <TileCard href="/admin/experience" icon={Briefcase} label="경력" count={data.experience.length}>
            {data.experience.length === 0 ? (
              <EmptyHint text="경력 없음" />
            ) : (
              <ul className="space-y-1 text-sm">
                {data.experience.slice(0, 3).map((e) => (
                  <li key={e._id} className="flex items-baseline gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground tracking-wider flex-shrink-0">
                      {e.period.end}
                    </span>
                    <span className="truncate text-foreground">{pickLang(e.title, lang)}</span>
                  </li>
                ))}
                {data.experience.length > 3 && (
                  <li className="text-xs text-muted-foreground pt-0.5">+ {data.experience.length - 3}개 더</li>
                )}
              </ul>
            )}
          </TileCard>

          {/* 기술 */}
          <TileCard href="/admin/skills" icon={Code2} label="기술" count={data.skills.length}>
            {data.skills.length === 0 ? (
              <EmptyHint text="기술 없음" />
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {data.skills.slice(0, 10).map((s) => (
                  <span
                    key={s._id}
                    className="inline-flex items-center px-2 py-0.5 border border-border rounded font-mono text-[10px] tracking-wider bg-background text-foreground"
                  >
                    {s.name}
                  </span>
                ))}
                {data.skills.length > 10 && (
                  <span className="text-xs text-muted-foreground self-center">+ {data.skills.length - 10}</span>
                )}
              </div>
            )}
          </TileCard>
        </div>
      </main>
    </>
  )
}

function TileCard({
  href,
  icon: Icon,
  label,
  count,
  hint,
  children,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  count?: number
  hint?: string
  children: React.ReactNode
}) {
  return (
    <Link href={href} className="block group">
      <Card className="h-full transition-colors group-hover:border-primary cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              {typeof count === "number" && (
                <span className="font-mono text-[11px] text-muted-foreground">· {count}</span>
              )}
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          {hint && (
            <div className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-primary mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {hint}
            </div>
          )}
        </CardHeader>
        <CardContent className="pt-0">{children}</CardContent>
      </Card>
    </Link>
  )
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground italic">
      <Plus className="h-3 w-3" />
      {text}
    </div>
  )
}
