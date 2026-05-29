"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  PanelsTopLeft, Home, Star, List, Play, User, GraduationCap,
  Briefcase, Code2, Image as ImageIcon, Globe, Settings, LogOut, Layers,
} from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const GROUPS = [
  {
    label: "Contents",
    items: [
      { href: "/admin/hero", label: "Hero · 한 줄 소개", icon: Home },
      { href: "/admin/works?type=featured", label: "Featured 영웅", icon: Star },
      { href: "/admin/works?type=other", label: "프로젝트 (상세)", icon: List },
      { href: "/admin/works?type=practice", label: "그 외 프로젝트 (간략)", icon: Layers },
      { href: "/admin/works?type=building", label: "Currently Building", icon: Play },
    ],
  },
  {
    label: "About",
    items: [
      { href: "/admin/about", label: "About 자기소개", icon: User },
      { href: "/admin/education", label: "Education 학력", icon: GraduationCap },
      { href: "/admin/experience", label: "Experience 경력", icon: Briefcase },
      { href: "/admin/skills", label: "Skills 기술", icon: Code2 },
    ],
  },
  {
    label: "Media",
    items: [{ href: "/admin/media", label: "이미지 · 영상", icon: ImageIcon }],
  },
  {
    label: "Settings",
    items: [
      { href: "/admin/settings/languages", label: "다국어 KR·JP·EN", icon: Globe },
      { href: "/admin/settings/account", label: "계정 · SEO", icon: Settings },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function onLogout() {
    const res = await fetch("/api/auth/logout", { method: "POST" })
    if (res.ok) {
      toast.success("로그아웃 완료")
      router.push("/login")
      router.refresh()
    } else {
      toast.error("로그아웃 실패")
    }
  }

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 flex-col border-r border-border bg-card shadow-md z-20">
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <Link href="/admin" className="flex items-center gap-2 px-3 py-2 mb-2">
          <PanelsTopLeft className="h-6 w-6 text-primary" />
          <h1 className="font-serif font-bold text-base tracking-tight">PORTFOLIO ADMIN</h1>
        </Link>

        {GROUPS.map((group) => (
          <div key={group.label} className="pt-5">
            <p className="text-xs font-medium text-muted-foreground px-4 pb-2">{group.label}</p>
            {group.items.map((item) => {
              const Icon = item.icon
              const itemPath = item.href.split("?")[0]
              const active = pathname === itemPath || (itemPath !== "/admin" && pathname.startsWith(itemPath))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 h-10 px-4 rounded-md text-sm transition-colors mb-1",
                    active
                      ? "bg-secondary text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  <Icon className={cn("h-[18px] w-[18px] flex-shrink-0", active && "text-primary")} />
                  <span className="truncate">{item.label}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </div>

      <div className="border-t border-border p-3">
        <Button onClick={onLogout} variant="outline" className="w-full justify-center gap-3">
          <LogOut className="h-[18px] w-[18px]" />
          Sign out
        </Button>
      </div>
    </aside>
  )
}
