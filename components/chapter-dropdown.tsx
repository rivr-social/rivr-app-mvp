"use client"

import type React from "react"

import { useState } from "react"
import { Check, MapPin } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { chapters } from "@/lib/mock-data"
import { useRouter } from "next/navigation"

interface ChapterDropdownProps {
  selectedChapter: string
  onChapterChange: (chapter: string) => void
  triggerElement?: React.ReactNode
}

export function ChapterDropdown({ selectedChapter, onChapterChange, triggerElement }: ChapterDropdownProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  // Add "All Chapters" option to the list
  const allChapters = [{ id: "all", name: "All Chapters", memberCount: 0, image: "/placeholder.svg" }, ...chapters]

  // Find the name of the currently selected chapter
  const selectedChapterObj = allChapters.find((chapter) => chapter.id === selectedChapter)

  // Filter chapters based on search query
  const filteredChapters = searchQuery
    ? allChapters.filter(
        (chapter) =>
          chapter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chapter.id.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : allChapters

  const handleSelect = (chapterId: string) => {
    onChapterChange(chapterId)
    setOpen(false)
    setSearchQuery("")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {triggerElement || (
          <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between min-w-[150px]">
            <MapPin className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{selectedChapterObj?.name || "Select Chapter"}</span>
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search chapters..." value={searchQuery} onValueChange={setSearchQuery} />
          <CommandList className="max-h-[300px] overflow-auto">
            <CommandEmpty>No chapter found.</CommandEmpty>
            <CommandGroup>
              {filteredChapters.map((chapter) => (
                <CommandItem
                  key={chapter.id}
                  value={chapter.name}
                  onSelect={() => handleSelect(chapter.id)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={chapter.image || "/placeholder.svg"} alt={chapter.name} />
                      <AvatarFallback>{chapter.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <span>{chapter.name}</span>
                      {chapter.id !== "all" && (
                        <span className="ml-2 text-xs text-muted-foreground">({chapter.memberCount} members)</span>
                      )}
                    </div>
                  </div>
                  <Check className={`ml-2 h-4 w-4 ${selectedChapter === chapter.id ? "opacity-100" : "opacity-0"}`} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
