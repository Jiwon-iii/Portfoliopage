import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center px-6">
      <div className="text-center max-w-md">
        <div className="font-mono text-xs text-primary tracking-widest mb-4">404 · NOT FOUND</div>
        <h1 className="font-serif text-7xl font-black tracking-tighter mb-4">404</h1>
        <p className="text-muted-foreground mb-8">없는 페이지야. 주소가 잘못됐거나, 옮겨졌거나, 아직 만들어지지 않은 곳.</p>
        <Button asChild>
          <Link href="/">처음으로 →</Link>
        </Button>
      </div>
    </main>
  )
}
