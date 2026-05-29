import { AdminNavbar } from "@/components/admin/navbar"
import { AboutForm } from "@/components/admin/about-form"
import { getAbout } from "@/lib/repo/about"

export const dynamic = "force-dynamic"

export default async function AboutAdminPage() {
  const about = await getAbout().catch(() => null)
  return (
    <>
      <AdminNavbar title="About" />
      <main className="max-w-5xl mx-auto px-8 py-8">
        <div className="mb-6">
          <h2 className="font-serif text-3xl font-extrabold tracking-tight">About · 자기소개</h2>
          <p className="text-muted-foreground text-sm mt-1">큰 인용문 + 본문 단락 여러 개로 구성.</p>
        </div>
        <AboutForm initial={about} />
      </main>
    </>
  )
}
