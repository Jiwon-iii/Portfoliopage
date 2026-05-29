"use client"

import { useState } from "react"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export type UploadedImage = { url: string; alt?: string | null }

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

  async function upload(files: FileList | File[]) {
    if (value.length + files.length > max) {
      toast.error(`최대 ${max}장까지 가능합니다`)
      return
    }
    setUploading(true)
    try {
      const uploaded: UploadedImage[] = []
      for (const file of Array.from(files)) {
        const form = new FormData()
        form.append("file", file)
        const res = await fetch("/api/upload", { method: "POST", body: form })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          toast.error(err.error || "업로드 실패")
          continue
        }
        const data = await res.json()
        uploaded.push({ url: data.url, alt: file.name })
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
        <div className="flex flex-wrap gap-2">
          {value.map((img, i) => (
            <div key={img.url} className="relative w-24 h-16 rounded overflow-hidden border border-border">
              <Image src={img.url} alt={img.alt || ""} fill className="object-cover" sizes="96px" />
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                className="absolute -top-2 -right-2 w-5 h-5 bg-foreground text-background rounded-full grid place-items-center"
                aria-label="이미지 제거"
              >
                <X className="h-3 w-3" />
              </button>
              {i === 0 && (
                <span className="absolute bottom-0 left-0 right-0 bg-primary text-primary-foreground text-[9px] font-mono tracking-wider text-center py-0.5">
                  THUMBNAIL
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
