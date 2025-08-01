"use client"
import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface EntitySelectItem {
  id: string
  name: string
  avatar?: string
  fallback?: string
  details?: string // e.g., username or last seen for users
}

interface EntityMultiSelectProps {
  label: string
  items: EntitySelectItem[]
  selectedIds: string[]
  onSelectionChange: (selectedIds: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  className?: string
  listHeight?: string
  showSelectedPills?: boolean
}

export function EntityMultiSelect({
  label,
  items,
  selectedIds,
  onSelectionChange,
  placeholder = "Select items...",
  searchPlaceholder = "Search...",
  className,
  listHeight = "h-[200px]",
  showSelectedPills = true,
}: EntityMultiSelectProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false) // Could be used if this was a dropdown/popover

  const filteredAndGroupedItems = useMemo(() => {
    const filtered = items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.details && item.details.toLowerCase().includes(searchTerm.toLowerCase())),
    )

    const groups: Record<string, EntitySelectItem[]> = {}
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
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={`search-${uniqueLabelId}`}>{label}</Label>
      {showSelectedPills && selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5 py-1.5">
          {selectedIds.map((id) => {
            const item = items.find((i) => i.id === id)
            return item ? (
              <span
                key={id}
                className="flex items-center text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full"
              >
                {item.avatar && (
                  <Avatar className="h-4 w-4 mr-1.5">
                    <AvatarImage src={item.avatar || "/placeholder.svg"} alt={item.name} />
                    <AvatarFallback className="text-xs">{item.fallback || item.name.substring(0, 1)}</AvatarFallback>
                  </Avatar>
                )}
                {item.name}
                <Button
                  variant="ghost"
                  size="xs"
                  className="ml-1 h-4 w-4 p-0"
                  onClick={() => handleToggleSelection(id)}
                >
                  <XIcon className="h-3 w-3" />
                </Button>
              </span>
            ) : null
          })}
        </div>
      )}
      <Input
        id={`search-${uniqueLabelId}`}
        type="search"
        placeholder={searchPlaceholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ScrollArea className={cn("border rounded-md", listHeight)}>
        <div className="p-1">
          {filteredAndGroupedItems.length === 0 && (
            <p className="text-sm text-muted-foreground p-4 text-center">No items found.</p>
          )}
          {filteredAndGroupedItems.map(([letter, groupItems]) => (
            <div key={letter}>
              <p className="text-xs font-semibold text-muted-foreground px-3 py-1.5 sticky top-0 bg-background/95 backdrop-blur-sm z-10 border-b">
                {letter}
              </p>
              {groupItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-3 px-3 py-2 hover:bg-accent rounded-md cursor-pointer"
                  onClick={() => handleToggleSelection(item.id)}
                  role="option"
                  aria-selected={selectedIds.includes(item.id)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      handleToggleSelection(item.id)
                    }
                  }}
                >
                  {item.avatar !== undefined && ( // Check if avatar prop exists, even if undefined
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={item.avatar || `/placeholder.svg?width=32&height=32&query=${item.name.charAt(0)}`}
                        alt={item.name}
                      />
                      <AvatarFallback>{item.fallback || item.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex-1">
                    <span id={`label-${item.id}-${uniqueLabelId}`} className="text-sm font-medium">
                      {item.name}
                    </span>
                    {item.details && <p className="text-xs text-muted-foreground">{item.details}</p>}
                  </div>
                  <Checkbox
                    id={`select-${item.id}-${uniqueLabelId}`}
                    checked={selectedIds.includes(item.id)}
                    onCheckedChange={() => handleToggleSelection(item.id)} // This will be triggered by div click too
                    aria-labelledby={`label-${item.id}-${uniqueLabelId}`}
                    className="ml-auto"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
