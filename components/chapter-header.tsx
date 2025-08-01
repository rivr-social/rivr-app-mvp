"use client"

import { useState, useEffect } from "react"
import { ChapterSelector } from "./chapter-selector"
import { chapters } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"

interface ChapterHeaderProps {
  selectedChapter: string
  onChapterChange: (chapter: string) => void
}

export function ChapterHeader({ selectedChapter, onChapterChange }: ChapterHeaderProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [prevScrollPos, setPrevScrollPos] = useState(0)

  // Hide header on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY
      setIsVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10)
      setPrevScrollPos(currentScrollPos)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [prevScrollPos])

  // Get current chapter info
  const currentChapter = selectedChapter === "all" ? null : chapters.find((c) => c.id === selectedChapter)

  return (
    <div
      className={`sticky z-40 w-full bg-background border-b transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{ top: "104px" }} // Position below the top bar
    >
      <div className="container max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex-1">
          {currentChapter ? (
            <div>
              <h2 className="text-lg font-semibold">{currentChapter.name}</h2>
              <p className="text-sm text-muted-foreground">
                <Badge variant="outline" className="mr-2">
                  {currentChapter.memberCount} members
                </Badge>
                {currentChapter.location?.address && <span className="text-xs">{currentChapter.location.address}</span>}
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold">All Chapters</h2>
              <p className="text-sm text-muted-foreground">Viewing content from all chapters</p>
            </div>
          )}
        </div>
        <ChapterSelector selectedChapter={selectedChapter} onChapterChange={onChapterChange} variant="prominent" />
      </div>
    </div>
  )
}
