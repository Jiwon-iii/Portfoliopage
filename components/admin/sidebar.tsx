"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import {
  PanelsTopLeft, Home, List, User, GraduationCap,
  Briefcase, Code2, LogOut, Layers,
  ChevronDown, FolderKanban,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type Item = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

type Group = {
  label: string
  icon: React.ComponentType<{ className?: string }>
  /** 부모 라벨 클릭 시 이동할 URL. 생략하면 펼침/접힘만 동작. */
  href?: string
  children: Item[]
}

type Section = {
  label: string
  items: Array<Item | Group>
}

const SECTIONS: Section[] = [
  {
    label: "콘텐츠",
    items: [
      { href: "/admin/hero", label: "대표 소개", icon: Home },
      {
        label: "프로젝트",
        icon: FolderKanban,
        href: "/admin/works",
        children: [
          { href: "/admin/works?type=general", label: "일반", icon: List },
          { href: "/admin/works?type=practice", label: "연습", icon: Layers },
        ],
      },
    ],
  },
  {
    label: "소개",
    items: [
      { href: "/admin/about", label: "자기소개", icon: User },
      { href: "/admin/education", label: "학력", icon: GraduationCap },
      { href: "/admin/experience", label: "경력", icon: Briefcase },
      { href: "/admin/skills", label: "기술", icon: Code2 },
    ],
  },
]

function isGroup(x: Item | Group): x is Group {
  return "children" in x
}

/**
 * 현재 pathname + query 가 item.href 와 매칭되는지.
 * - 쿼리 있는 href ("/admin/works?type=featured") → pathname 동일 + type 동일해야 active
 * - 쿼리 없는 href ("/admin/hero") → pathname startsWith
 */
function isItemActive(href: string, pathname: string, search: URLSearchParams): boolean {
  const [path, query] = href.split("?")
  if (query) {
    if (pathname !== path) return false
    const target = new URLSearchParams(query)
    for (const [k, v] of target.entries()) {
      if (search.get(k) !== v) return false
    }
    return true
  }
  if (path === "/admin") return pathname === "/admin"
  return pathname === path || pathname.startsWith(path + "/")
}

export function AdminSidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  // 어떤 그룹이 펼쳐져 있는지 (label 기준). 페이지 진입 시 active 자식 포함된 그룹은 자동으로 펼침.
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})

  // 페이지 바뀔 때 active 자식 가진 그룹 또는 부모 자체가 active 면 자동으로 펼침
  useEffect(() => {
    const next: Record<string, boolean> = {}
    SECTIONS.forEach((section) => {
      section.items.forEach((item) => {
        if (isGroup(item)) {
          const selfActive = item.href ? isItemActive(item.href, pathname, searchParams) : false
          const anyChildActive = item.children.some((c) => isItemActive(c.href, pathname, searchParams))
          if (selfActive || anyChildActive) next[item.label] = true
        }
      })
    })
    setOpenGroups((prev) => ({ ...next, ...prev }))
  }, [pathname, searchParams])

  function toggleGroup(label: string) {
    setOpenGroups((s) => ({ ...s, [label]: !s[label] }))
  }

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

        {SECTIONS.map((section) => (
          <div key={section.label} className="pt-5">
            <p className="text-xs font-medium text-muted-foreground px-4 pb-2">{section.label}</p>
            {section.items.map((item) => {
              if (!isGroup(item)) {
                const Icon = item.icon
                const active = isItemActive(item.href, pathname, searchParams)
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
              }

              // Group with children
              const GroupIcon = item.icon
              const open = openGroups[item.label] ?? false
              const anyChildActive = item.children.some((c) => isItemActive(c.href, pathname, searchParams))
              // 자식이 active 면 부모는 self-active 가 아님 (구분 표시)
              const parentSelfActive = item.href
                ? isItemActive(item.href, pathname, searchParams) && !anyChildActive
                : false
              const parentHighlighted = parentSelfActive || anyChildActive

              const rowClasses = cn(
                "flex items-center gap-3 h-10 px-4 rounded-md text-sm transition-colors",
                parentSelfActive
                  ? "bg-secondary text-foreground font-semibold"
                  : parentHighlighted
                    ? "text-foreground font-semibold hover:bg-accent"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )

              return (
                <div key={item.label} className="mb-1">
                  {item.href ? (
                    <div className={rowClasses + " pr-1"}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 flex-1 min-w-0"
                      >
                        <GroupIcon className={cn("h-[18px] w-[18px] flex-shrink-0", parentHighlighted && "text-primary")} />
                        <span className="flex-1 truncate text-left">{item.label}</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleGroup(item.label)}
                        aria-label={open ? `${item.label} 접기` : `${item.label} 펼치기`}
                        className="p-1 rounded hover:bg-background/60 flex-shrink-0"
                      >
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            open && "rotate-180",
                          )}
                        />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleGroup(item.label)}
                      className={cn(rowClasses, "w-full")}
                    >
                      <GroupIcon className={cn("h-[18px] w-[18px] flex-shrink-0", parentHighlighted && "text-primary")} />
                      <span className="flex-1 truncate text-left">{item.label}</span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform flex-shrink-0",
                          open && "rotate-180",
                        )}
                      />
                    </button>
                  )}
                  {open && (
                    <div className="ml-3 mt-0.5 border-l border-border pl-2">
                      {item.children.map((child) => {
                        const Icon = child.icon
                        const active = isItemActive(child.href, pathname, searchParams)
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "flex items-center gap-3 h-9 px-3 rounded-md text-[13px] transition-colors mb-0.5",
                              active
                                ? "bg-secondary text-foreground font-semibold"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground",
                            )}
                          >
                            <Icon className={cn("h-4 w-4 flex-shrink-0", active && "text-primary")} />
                            <span className="truncate">{child.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div className="border-t border-border p-3">
        <Button onClick={onLogout} variant="outline" className="w-full justify-center gap-3">
          <LogOut className="h-[18px] w-[18px]" />
          로그아웃
        </Button>
      </div>
    </aside>
  )
}
