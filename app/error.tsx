"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[error.tsx]", error)
  }, [error])

  return (
    <main className="min-h-screen grid place-items-center px-6">
      <div className="text-center max-w-md">
        <div className="font-mono text-xs text-destructive tracking-widest mb-4">500 · ERROR</div>
        <h1 className="font-serif text-5xl font-black tracking-tighter mb-4">뭔가 어긋났어요</h1>
        <p className="text-muted-foreground mb-8">잠깐 새로고침 해보거나, 처음으로 돌아가세요.</p>
        {error.digest && (
          <p className="font-mono text-xs text-muted-foreground mb-6">에러 ID: {error.digest}</p>
        )}
        <div className="flex gap-3 justify-center">
          <Button onClick={() => reset()}>다시 시도</Button>
          <Button asChild variant="outline">
            <a href="/">처음으로</a>
          </Button>
        </div>
      </div>
    </main>
  )
}
