import { AdminNavbar } from "@/components/admin/navbar"
import { HeroForm } from "@/components/admin/hero-form"
import { getHero } from "@/lib/repo/hero"

export const dynamic = "force-dynamic"

export default async function HeroAdminPage() {
  const hero = await getHero().catch(() => null)
  return (
    <>
      <AdminNavbar title="Hero" />
      <main className="max-w-5xl mx-auto px-8 py-8">
        <div className="mb-6">
          <h2 className="font-serif text-3xl font-extrabold tracking-tight">Hero · 한 줄 소개</h2>
          <p className="text-muted-foreground text-sm mt-1">메인 사이트 최상단에 표시될 정보.</p>
        </div>
        <HeroForm initial={hero} />
      </main>
    </>
  )
}
