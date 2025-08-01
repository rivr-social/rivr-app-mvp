"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { getChapterName } from "@/lib/utils"

interface TagDisplayProps {
  tags: string[]
  type: "chapter" | "group" | "skill"
  maxDisplay?: number
  showCount?: boolean
  className?: string
  badgeVariant?: "default" | "secondary" | "outline" | "destructive"
}

export function TagDisplay({
  tags,
  type,
  maxDisplay = 5,
  showCount = true,
  className = "",
  badgeVariant = "secondary",
}: TagDisplayProps) {
  const [showAll, setShowAll] = useState(false)
  const displayTags = showAll ? tags : tags.slice(0, maxDisplay)
  const hasMore = tags.length > maxDisplay

  // Function to get the display name for a tag
  const getTagName = (tagId: string) => {
    if (type === "chapter") {
      return getChapterName(tagId)
    }
    return tagId
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        {displayTags.map((tag) => (
          <Badge key={tag} variant={badgeVariant}>
            {getTagName(tag)}
          </Badge>
        ))}
        {!showAll && hasMore && showCount && (
          <Badge variant="outline" className="bg-muted/50">
            +{tags.length - maxDisplay} more
          </Badge>
        )}
      </div>

      {hasMore && (
        <Button variant="ghost" size="sm" className="mt-2 h-8 px-2 text-xs" onClick={() => setShowAll(!showAll)}>
          {showAll ? (
            <>
              <ChevronUp className="mr-1 h-4 w-4" /> Show Less
            </>
          ) : (
            <>
              <ChevronDown className="mr-1 h-4 w-4" /> Show All
            </>
          )}
        </Button>
      )}
    </div>
  )
}
