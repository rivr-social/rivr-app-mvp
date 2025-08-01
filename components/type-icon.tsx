import { MessageSquare, Calendar, Users, User, Briefcase, Package, BookOpen, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface TypeIconProps {
  type: string
  className?: string
  size?: number
}

export function TypeIcon({ type, className, size = 16 }: TypeIconProps) {
  const iconProps = {
    size,
    className: cn("text-gray-500", className),
  }

  switch (type.toLowerCase()) {
    case "post":
      return <MessageSquare {...iconProps} />
    case "event":
      return <Calendar {...iconProps} />
    case "group":
      return <Users {...iconProps} />
    case "person":
      return <User {...iconProps} />
    case "task":
      return <Briefcase {...iconProps} />
    case "resource":
      return <Package {...iconProps} />
    case "skill":
      return <BookOpen {...iconProps} />
    case "thanks":
      return <Heart {...iconProps} />
    default:
      return <MessageSquare {...iconProps} />
  }
}
