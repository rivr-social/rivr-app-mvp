"use client"
import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface SelectableItem {
  id: string
  name: string
  avatar?: string
  fallback?: string
}

interface MultiSelectSearchableListProps {
  label: string
  items: SelectableItem[]
  selectedIds: string[]
  onSelectionChange: (selectedIds: string[]) => void
  placeholder?: string
  className?: string
  listHeight?: string
}

export function MultiSelectSearchableList({
  label,
  items,
  selectedIds,
  onSelectionChange,
  placeholder = "Search...",
  className,
  listHeight = "h-[200px]",
}: MultiSelectSearchableListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAndGroupedItems = useMemo(() => {
    const filtered = items.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const groups: Record<string, SelectableItem[]> = {}
    filtered.forEach((item) => {
      const firstLetter = item.name[0]?.toUpperCase() || "#"
      if (!groups[firstLetter]) {
        groups[firstLetter] = []
      }
      groups[firstLetter]?.push(item)
    })
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  }, [items, searchTerm])

  const handleToggleSelection = (itemId: string) => {
    const newSelectedIds = selectedIds.includes(itemId)
      ? selectedIds.filter((id) => id !== itemId)
      : [...selectedIds, itemId]
    onSelectionChange(newSelectedIds)
  }

  const uniqueLabelId = label.replace(/\s+/g, "-").toLowerCase()

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={`search-${uniqueLabelId}`}>{label}</Label>
      <Input
        id={`search-${uniqueLabelId}`}
        type="search"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-2"
      />
      <ScrollArea className={cn("border rounded-md", listHeight)}>
        <div className="p-2 space-y-1">
          {filteredAndGroupedItems.length === 0 && (
            <p className="text-sm text-muted-foreground p-2 text-center">No items found.</p>
          )}
          {filteredAndGroupedItems.map(([letter, groupItems]) => (
            <div key={letter}>
              <p className="text-xs font-semibold text-muted-foreground px-2 py-1 sticky top-0 bg-background/90 backdrop-blur-sm z-10">
                {letter}
              </p>
              {groupItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-3 p-2 hover:bg-accent rounded-md cursor-pointer"
                  onClick={() => handleToggleSelection(item.id)}
                  role="checkbox"
                  aria-checked={selectedIds.includes(item.id)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      handleToggleSelection(item.id)
                    }
                  }}
                >
                  <Checkbox
                    id={`select-${item.id}-${uniqueLabelId}`}
                    checked={selectedIds.includes(item.id)}
                    onCheckedChange={() => handleToggleSelection(item.id)}
                    aria-labelledby={`label-${item.id}-${uniqueLabelId}`}
                  />
                  {item.avatar !== undefined && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={item.avatar || `/placeholder.svg?width=32&height=32&query=${item.name.charAt(0)}`}
                        alt={item.name}
                      />
                      <AvatarFallback>{item.fallback || item.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}
                  <span id={`label-${item.id}-${uniqueLabelId}`} className="flex-1 text-sm">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>
      {selectedIds.length > 0 && (
        <div className="pt-2 flex flex-wrap gap-1">
          <p className="text-xs text-muted-foreground w-full mb-1">Selected ({selectedIds.length}):</p>
          {selectedIds.map((id) => {
            const item = items.find((i) => i.id === id)
            return item ? (
              <span key={id} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                {item.name}
              </span>
            ) : null
          })}
        </div>
      )}
    </div>
  )
}
