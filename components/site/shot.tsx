import Image from "next/image"
import { cn } from "@/lib/utils"
import type { ImageRef } from "@/lib/schemas/i18n-field"

/** 사진 틀 (둥근 모서리·마우스 올리면 살짝 확대는 site.css 의 .shot). */
export function Shot({
  image,
  alt,
  className,
  sizes = "(max-width: 860px) 100vw, 33vw",
  priority,
}: {
  image: ImageRef
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
}) {
  return (
    <figure className={cn("shot", className)}>
      <Image src={image.url} alt={image.alt || alt} fill sizes={sizes} priority={priority} />
    </figure>
  )
}
