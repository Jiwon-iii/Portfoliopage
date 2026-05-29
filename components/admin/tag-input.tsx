"use client"

import { useState } from "react"
import { X } from "lucide-react"

export function TagInput({
  value,
  onChange,
  placeholder = "+ 태그 추가 (Enter)",
}: {
  value: string[]
  onChange: (next: string[]) => void
  placeholder?: string
}) {
  const [draft, setDraft] = useState("")

  function add(tag: string) {
    const t = tag.trim()
    if (!t || value.includes(t)) return
    onChange([...value, t])
    setDraft("")
  }
  function remove(idx: number) {
    onChange(value.filter((_, i) => i !== idx))
  }

  return (
    <div className="flex flex-wrap gap-1.5 p-1.5 border border-input rounded-md min-h-9 items-center bg-background">
      {value.map((tag, i) => (
        <span
          key={`${tag}-${i}`}
          className="inline-flex items-center gap-1.5 h-6 px-2 bg-foreground text-background rounded text-[11px] font-mono tracking-wider"
        >
          {tag}
          <button type="button" onClick={() => remove(i)} className="opacity-70 hover:opacity-100">
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            add(draft)
          } else if (e.key === "Backspace" && !draft && value.length) {
            remove(value.length - 1)
          }
        }}
        onBlur={() => draft && add(draft)}
        placeholder={value.length === 0 ? placeholder : ""}
        className="border-0 bg-transparent outline-none text-sm px-1 flex-1 min-w-20 h-6"
      />
    </div>
  )
}
