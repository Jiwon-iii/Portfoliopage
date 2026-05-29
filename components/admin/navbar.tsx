import Link from "next/link"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AdminNavbar({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-10 h-14 bg-background/95 backdrop-blur border-b border-border">
      <div className="h-full flex items-center justify-between px-8">
        <h1 className="font-serif font-bold text-base tracking-tight">{title}</h1>
        <div className="flex items-center gap-2">
          <span className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground tracking-wider mr-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            연결됨
          </span>
          <Button asChild variant="outline" size="sm">
            <Link href="/" target="_blank">
              <Eye className="h-4 w-4" />
              미리보기
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
