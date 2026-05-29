"use client"

import { useState } from "react"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export type UploadedImage = {
  url: string
  alt?: string | null
  width?: number
  height?: number
}

async function readDimensions(file: File): Promise<{ width: number; height: number } | null> {
  const url = URL.createObjectURL(file)
  try {
    const img = new window.Image()
    img.src = url
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error("dimension read failed"))
    })
    return { width: img.naturalWidth, height: img.naturalHeight }
  } catch {
    return null
  } finally {
    URL.revokeObjectURL(url)
  }
}

export function ImageUpload({
  value,
  onChange,
  max = 5,
}: {
  value: UploadedImage[]
  onChange: (next: UploadedImage[]) => void
  max?: number
}) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  // 썸네일 순서 변경(드래그)용
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  function reorder(from: number, to: number) {
    if (from === to) return
    const next = [...value]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    onChange(next)
  }

  async function upload(files: FileList | File[]) {
    if (value.length + files.length > max) {
      toast.error(`최대 ${max}장까지 가능합니다`)
      return
    }
    setUploading(true)
    try {
      const uploaded: UploadedImage[] = []
      for (const file of Array.from(files)) {
        const dims = await readDimensions(file)
        const form = new FormData()
        form.append("file", file)
        const res = await fetch("/api/upload", { method: "POST", body: form })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          toast.error(err.error || "업로드 실패")
          continue
        }
        const data = await res.json()
        uploaded.push({
          url: data.url,
          alt: file.name,
          ...(dims ? { width: dims.width, height: dims.height } : {}),
        })
      }
      if (uploaded.length) {
        onChange([...value, ...uploaded])
        toast.success(`${uploaded.length}장 업로드 완료`)
      }
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <label
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          if (e.dataTransfer.files.length) upload(e.dataTransfer.files)
        }}
        className={cn(
          "block border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors",
          dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
          uploading && "opacity-50 pointer-events-none",
        )}
      >
        <Upload className="h-7 w-7 mx-auto text-muted-foreground mb-2" />
        <div className="font-semibold text-sm mb-1">
          {uploading ? "업로드 중..." : "이미지 끌어다 놓기 또는 클릭"}
        </div>
        <div className="text-xs text-muted-foreground">PNG · JPG · WebP · GIF · 최대 5MB</div>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && upload(e.target.files)}
        />
      </label>

      {value.length > 0 && (
        <>
          <p className="text-xs text-muted-foreground pt-1">
            드래그해서 순서를 바꿀 수 있어요. 첫 번째 이미지가 썸네일로 사용됩니다.
          </p>
          <div className="flex flex-wrap gap-4 pt-1 pr-2">
            {value.map((img, i) => (
              <div
                key={img.url}
                draggable
                onDragStart={(e) => {
                  setDragIndex(i)
                  e.dataTransfer.effectAllowed = "move"
                }}
                onDragOver={(e) => {
                  e.preventDefault()
                  e.dataTransfer.dropEffect = "move"
                  if (overIndex !== i) setOverIndex(i)
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  if (dragIndex !== null) reorder(dragIndex, i)
                  setDragIndex(null)
                  setOverIndex(null)
                }}
                onDragEnd={() => {
                  setDragIndex(null)
                  setOverIndex(null)
                }}
                className={cn(
                  "relative w-36 h-28 rounded-md cursor-move transition-all",
                  dragIndex === i && "opacity-40",
                  overIndex === i && dragIndex !== i && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                )}
              >
                {/* 이미지 컨테이너 — overflow-hidden 으로 라운드 처리 */}
                <div className="absolute inset-0 rounded-md overflow-hidden border border-border bg-secondary">
                  <Image
                    src={img.url}
                    alt={img.alt || ""}
                    fill
                    draggable={false}
                    className="object-cover pointer-events-none"
                    sizes="144px"
                  />
                  {i === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-primary text-primary-foreground text-[10px] font-mono tracking-wider text-center py-1">
                      THUMBNAIL
                    </span>
                  )}
                </div>
                {/* X 버튼 — 컨테이너 밖에 있어서 잘리지 않음 */}
                <button
                  type="button"
                  onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-zinc-900 text-white rounded-full grid place-items-center shadow-md ring-2 ring-background hover:bg-destructive hover:scale-110 transition-all z-10"
                  aria-label="이미지 제거"
                >
                  <X className="h-3 w-3 stroke-[2.5]" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
