"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const chapters = [
  {
    value: "boulder",
    label: "Boulder",
    id: "boulder",
  },
  {
    value: "denver",
    label: "Denver",
    id: "denver",
  },
  {
    value: "ftcollins",
    label: "Fort Collins",
    id: "ftcollins",
  },
  {
    value: "longmont",
    label: "Longmont",
    id: "longmont",
  },
]

interface ChapterSwitcherProps {
  onChapterChange: (chapterId: string) => void
}

export function ChapterSwitcher({ onChapterChange }: ChapterSwitcherProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("boulder")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="flex items-center gap-1 px-0 font-normal"
        >
          <span className="text-xl font-semibold text-primary">
            ONE {chapters.find((chapter) => chapter.value === value)?.label}
          </span>
          <ChevronDown className="h-4 w-4 text-primary opacity-70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search chapter..." />
          <CommandList>
            <CommandEmpty>No chapter found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                key="all"
                value="all"
                onSelect={() => {
                  setValue("all")
                  setOpen(false)
                  onChapterChange("all")
                }}
              >
                <Check className={cn("mr-2 h-4 w-4", value === "all" ? "opacity-100" : "opacity-0")} />
                All Chapters
              </CommandItem>
              {chapters.map((chapter) => (
                <CommandItem
                  key={chapter.value}
                  value={chapter.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    onChapterChange(chapter.id)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === chapter.value ? "opacity-100" : "opacity-0")} />
                  {chapter.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
