"use client"

import * as React from "react"
import { Check, ChevronDown, Globe, MapPin, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { chapters } from "@/lib/mock-data"
import { Input } from "@/components/ui/input"

interface ChapterSelectorProps {
  selectedChapter: string
  onChapterChange: (chapter: string) => void
  variant?: "default" | "compact" | "prominent"
}

export function ChapterSelector({ selectedChapter, onChapterChange, variant = "default" }: ChapterSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  // Find the currently selected chapter
  const selectedChapterObj =
    selectedChapter === "all"
      ? { id: "all", name: "All Chapters", image: null }
      : chapters.find((c) => c.id === selectedChapter) || { id: "all", name: "All Chapters", image: null }

  // Track recent chapters
  const [recentChapters, setRecentChapters] = React.useState<string[]>([])

  // Load recent chapters from localStorage
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("recentChapters")
      if (saved) {
        try {
          setRecentChapters(JSON.parse(saved))
        } catch (e) {
          console.error("Failed to parse recent chapters:", e)
        }
      }
    }
  }, [])

  // Save recent chapters to localStorage when they change
  React.useEffect(() => {
    if (typeof window !== "undefined" && recentChapters.length > 0) {
      localStorage.setItem("recentChapters", JSON.stringify(recentChapters))
    }
  }, [recentChapters])

  // Focus search input when dropdown opens
  React.useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    } else {
      // Clear search when dropdown closes
      setSearchQuery("")
    }
  }, [open])

  // Handle chapter selection
  const handleSelectChapter = (chapterId: string) => {
    // Call the parent's onChapterChange function
    onChapterChange(chapterId)
    setOpen(false)

    // Don't add "all" to recent chapters
    if (chapterId === "all") return

    // Add to recent chapters (if not already at the top)
    setRecentChapters((prev) => {
      const filtered = prev.filter((id) => id !== chapterId)
      return [chapterId, ...filtered].slice(0, 5) // Keep only the 5 most recent
    })
  }

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    // Ensure input keeps focus
    e.currentTarget.focus()
  }

  // Handle clear search button click
  const handleClearSearch = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation() // Prevent event bubbling
    setSearchQuery("")
    // Refocus the input after clearing
    setTimeout(() => {
      searchInputRef.current?.focus()
    }, 0)
  }

  // Get recent chapters objects
  const recentChapterObjs = recentChapters
    .map((id) => chapters.find((c) => c.id === id))
    .filter(Boolean) as typeof chapters

  // Filter chapters based on search query
  const filteredChapters = chapters.filter((chapter) => {
    if (!searchQuery) return true
    return chapter.name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant === "prominent" ? "default" : "outline"}
          className={cn(
            "flex items-center gap-2",
            variant === "prominent"
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-background border-primary/20 hover:bg-primary/5 hover:border-primary/30",
            variant === "compact" ? "h-9 px-3" : "h-10 px-4",
          )}
        >
          {variant === "prominent" ? (
            <>
              <MapPin className="mr-2 h-4 w-4" />
              <span className="font-medium">{selectedChapterObj.name}</span>
            </>
          ) : (
            <>
              <Globe className="mr-2 h-4 w-4 text-primary" />
              <span
                className={cn("font-medium text-foreground", variant === "compact" ? "max-w-[100px] truncate" : "")}
              >
                {selectedChapterObj.name}
              </span>
            </>
          )}
          <ChevronDown className="ml-1 h-4 w-4 shrink-0 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" onCloseAutoFocus={(e) => e.preventDefault()}>
        {/* Search input */}
        <div className="p-2 border-b" onClick={(e) => e.stopPropagation()}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search chapters..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-8 h-9 focus-visible:ring-primary"
              onKeyDown={(e) => e.stopPropagation()} // Prevent dropdown keyboard shortcuts from interfering
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          <DropdownMenuLabel>Current</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => handleSelectChapter("all")}
            className="flex items-center justify-between cursor-pointer"
            onSelect={(e) => e.preventDefault()} // Prevent auto-selection
          >
            <div className="flex items-center">
              <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>All Chapters</span>
            </div>
            {selectedChapter === "all" && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>

          {recentChapterObjs.length > 0 && !searchQuery && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Recent</DropdownMenuLabel>
              <DropdownMenuGroup>
                {recentChapterObjs.map((chapter) => (
                  <DropdownMenuItem
                    key={`recent-${chapter.id}`}
                    onClick={() => handleSelectChapter(chapter.id)}
                    className="flex items-center justify-between cursor-pointer"
                    onSelect={(e) => e.preventDefault()} // Prevent auto-selection
                  >
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{chapter.name}</span>
                    </div>
                    {selectedChapter === chapter.id && <Check className="h-4 w-4 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </>
          )}

          {filteredChapters.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>All Chapters</DropdownMenuLabel>
              <DropdownMenuGroup>
                {filteredChapters.map((chapter) => (
                  <DropdownMenuItem
                    key={chapter.id}
                    onClick={() => handleSelectChapter(chapter.id)}
                    className="flex items-center justify-between cursor-pointer"
                    onSelect={(e) => e.preventDefault()} // Prevent auto-selection
                  >
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{chapter.name}</span>
                    </div>
                    {selectedChapter === chapter.id && <Check className="h-4 w-4 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </>
          )}

          {filteredChapters.length === 0 && (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">No chapters found</div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
