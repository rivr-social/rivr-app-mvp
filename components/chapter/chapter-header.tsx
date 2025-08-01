"use client"
import { MapPin, Users, Calendar, FileText } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Chapter } from "@/lib/types"

interface ChapterHeaderProps {
  chapter: Chapter
  isFollowing?: boolean
  onFollow?: () => void
}

export function ChapterHeader({ chapter, isFollowing = false, onFollow }: ChapterHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="relative h-48 w-full overflow-hidden rounded-lg">
        <Image
          src={chapter.coverImage || "/placeholder.svg?height=192&width=768&query=chapter+banner"}
          alt={chapter.name}
          className="object-cover"
          fill
          priority
        />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-background">
            <Image
              src={chapter.avatar || "/placeholder.svg?height=64&width=64&query=chapter+logo"}
              alt={chapter.name}
              className="object-cover"
              fill
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{chapter.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{chapter.location}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant={isFollowing ? "outline" : "default"} onClick={onFollow}>
            {isFollowing ? "Following" : "Follow"}
          </Button>
          <Button variant="outline">Share</Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span>{chapter.memberCount || 0} members</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>{chapter.eventCount || 0} events</span>
        </div>
        <div className="flex items-center gap-1">
          <FileText className="h-4 w-4" />
          <span>{chapter.postCount || 0} posts</span>
        </div>
      </div>

      {chapter.tags && chapter.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {chapter.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
