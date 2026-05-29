import { AdminNavbar } from "@/components/admin/navbar"
import { AboutForm } from "@/components/admin/about-form"
import { getAbout } from "@/lib/repo/about"

export const dynamic = "force-dynamic"

export default async function AboutAdminPage() {
  const about = await getAbout().catch(() => null)
  return (
    <>
      <AdminNavbar title="자기소개" />
      <main className="max-w-5xl mx-auto px-8 py-8">
        <div className="mb-6">
          <h2 className="font-serif text-3xl font-extrabold tracking-tight">자기소개</h2>
          <p className="text-muted-foreground text-sm mt-1">큰 인용문 + 본문 단락 + 사진(여러 장이면 슬라이더).</p>
        </div>
        <AboutForm initial={about} />
      </main>
    </>
  )
}
