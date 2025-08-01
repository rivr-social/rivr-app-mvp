"use client"

import Link from "next/link"
import { MessageSquare, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChapterSelector } from "@/components/chapter-selector"
import { UserMenu } from "@/components/user-menu"

interface TopBarProps {
  selectedChapter: string
  onChapterChange: (chapter: string) => void
}

export function TopBar({ selectedChapter, onChapterChange }: TopBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-xl text-primary">
            ONE Local
          </Link>
        </div>

        <div className="flex-1 ml-4 flex items-center">
          {/* Chapter Selector */}
          <ChapterSelector selectedChapter={selectedChapter} onChapterChange={onChapterChange} variant="prominent" />
        </div>

        <div className="flex items-center gap-2 ml-4">
          <Link href="/messages">
            <Button variant="ghost" size="icon" aria-label="Messages">
              <MessageSquare className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/create">
            <Button size="icon" aria-label="Create" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-5 w-5" />
            </Button>
          </Link>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
