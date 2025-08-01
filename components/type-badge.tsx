import { cn } from "@/lib/utils"
import { TypeIcon } from "./type-icon"

interface TypeBadgeProps {
  type: string
  className?: string
  showIcon?: boolean
}

export function TypeBadge({ type, className, showIcon = true }: TypeBadgeProps) {
  return (
    <span className={cn(`type-badge type-${type.toLowerCase()}`, className)}>
      {showIcon && <TypeIcon type={type} className="mr-1 inline-block" size={12} />}
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  )
}
