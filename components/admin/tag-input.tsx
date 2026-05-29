"use client"

import { useState } from "react"
import { GripVertical, X } from "lucide-react"

export function TagInput({
  value,
  onChange,
  placeholder = "+ 태그 추가 (Enter)",
  reorderable = false,
}: {
  value: string[]
  onChange: (next: string[]) => void
  placeholder?: string
  reorderable?: boolean
}) {
  const [draft, setDraft] = useState("")
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [overIdx, setOverIdx] = useState<number | null>(null)

  function add(tag: string) {
    const t = tag.trim()
    if (!t || value.includes(t)) return
    onChange([...value, t])
    setDraft("")
  }
  function remove(idx: number) {
    onChange(value.filter((_, i) => i !== idx))
  }
  function reorder(from: number, to: number) {
    if (from === to || from < 0 || to < 0 || from >= value.length || to >= value.length) return
    const next = value.slice()
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    onChange(next)
  }

  return (
    <div className="flex flex-wrap gap-1.5 p-1.5 border border-input rounded-md min-h-9 items-center bg-background">
      {value.map((tag, i) => {
        const isDragging = dragIdx === i
        const isOver = overIdx === i && dragIdx !== null && dragIdx !== i
        return (
          <span
            key={`${tag}-${i}`}
            draggable={reorderable}
            onDragStart={
              reorderable
                ? (e) => {
                    setDragIdx(i)
                    e.dataTransfer.effectAllowed = "move"
                  }
                : undefined
            }
            onDragOver={
              reorderable
                ? (e) => {
                    e.preventDefault()
                    setOverIdx(i)
                  }
                : undefined
            }
            onDragLeave={reorderable ? () => setOverIdx((v) => (v === i ? null : v)) : undefined}
            onDrop={
              reorderable
                ? (e) => {
                    e.preventDefault()
                    if (dragIdx !== null) reorder(dragIdx, i)
                    setDragIdx(null)
                    setOverIdx(null)
                  }
                : undefined
            }
            onDragEnd={
              reorderable
                ? () => {
                    setDragIdx(null)
                    setOverIdx(null)
                  }
                : undefined
            }
            className={
              "inline-flex items-center gap-1.5 h-6 px-2 bg-foreground text-background rounded text-[11px] font-mono tracking-wider select-none" +
              (reorderable ? " cursor-grab active:cursor-grabbing" : "") +
              (isDragging ? " opacity-40" : "") +
              (isOver ? " ring-2 ring-primary ring-offset-1 ring-offset-background" : "")
            }
          >
            {reorderable && <GripVertical className="h-3 w-3 opacity-60" />}
            {tag}
            <button type="button" onClick={() => remove(i)} className="opacity-70 hover:opacity-100">
              <X className="h-3 w-3" />
            </button>
          </span>
        )
      })}
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
