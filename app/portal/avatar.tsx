import { cn } from "@/lib/utils"

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join("")
}

export function Avatar({
  name,
  src,
  className,
}: {
  name: string
  src: string | null | undefined
  className?: string
}) {
  if (src) {
    return <img src={src} alt="" className={cn("rounded-full border border-white/15 object-cover", className)} />
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-[#d4a42a]/40 to-[#1e3a8a]/50 font-semibold text-white/90",
        className
      )}
    >
      {initials(name) || "?"}
    </span>
  )
}
