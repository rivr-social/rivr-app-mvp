"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { chapters, groups } from "@/lib/mock-data"
import { getChapterName } from "@/lib/utils"

interface TagSelectorProps {
  type: "chapter" | "group"
  selectedTags: string[]
  onChange: (tags: string[]) => void
  label?: string
}

export function TagSelector({ type, selectedTags, onChange, label = "Add Tag" }: TagSelectorProps) {
  const [open, setOpen] = useState(false)
  const [availableTags, setAvailableTags] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    if (type === "chapter") {
      setAvailableTags(chapters.map((chapter) => ({ id: chapter.id, name: chapter.name })))
    } else if (type === "group") {
      setAvailableTags(groups.map((group) => ({ id: group.id, name: group.name })))
    }
  }, [type])

  const handleSelect = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter((id) => id !== tagId))
    } else {
      onChange([...selectedTags, tagId])
    }
  }

  const handleRemove = (tagId: string) => {
    onChange(selectedTags.filter((id) => id !== tagId))
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 mb-2">
        {selectedTags.map((tagId) => {
          const tag = availableTags.find((t) => t.id === tagId)
          const displayName = tag ? tag.name : type === "chapter" ? getChapterName(tagId) : tagId

          return (
            <Badge key={tagId} variant="secondary" className="flex items-center gap-1">
              {displayName}
              <button
                className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-1"
                onClick={() => handleRemove(tagId)}
              >
                ×
              </button>
            </Badge>
          )
        })}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-full text-muted-foreground"
          >
            <span>{label}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-full min-w-[200px]">
          <Command>
            <CommandInput placeholder={`Search ${type}s...`} />
            <CommandList>
              <CommandEmpty>No {type} found.</CommandEmpty>
              <CommandGroup>
                {availableTags.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    value={tag.id}
                    onSelect={() => {
                      handleSelect(tag.id)
                      setOpen(false)
                    }}
                  >
                    <Check className={`mr-2 h-4 w-4 ${selectedTags.includes(tag.id) ? "opacity-100" : "opacity-0"}`} />
                    {tag.name}
                  </CommandItem>
                ))}
                <CommandItem
                  className="text-muted-foreground"
                  onSelect={() => {
                    // In a real app, this would open a modal to create a new tag
                    console.log(`Create new ${type}`)
                    setOpen(false)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create new {type}
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
