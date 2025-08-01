"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Group } from "@/lib/types"
import { EntityMultiSelect, type EntitySelectItem } from "./entity-multi-select"
import { mockUsers, chapters as mockChapters } from "@/lib/mock-data"
import { useAppContext } from "@/contexts/app-context"

export interface SubgroupCreationData {
  name: string
  summary: string
  locationCity: string
  venue: string
  details: string
  chapterIds: string[]
  adminUserIds: string[]
  memberUserIds: string[]
  imageUrl: string
}

interface SubgroupCreatorProps {
  parentGroupId: string
  onSubmit: (data: SubgroupCreationData) => void
  onCancel: () => void
  parentGroup?: Group
}

export function SubgroupCreator({ parentGroupId, onSubmit, onCancel, parentGroup }: SubgroupCreatorProps) {
  const { state } = useAppContext()
  const currentUser = state.currentUser

  const [name, setName] = useState("")
  const [summary, setSummary] = useState("")
  const [locationCity, setLocationCity] = useState(parentGroup?.location?.city || "")
  const [venue, setVenue] = useState(parentGroup?.venue || "")
  const [details, setDetails] = useState("")
  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>(parentGroup?.chapterTags || [])
  const [selectedAdminUserIds, setSelectedAdminUserIds] = useState<string[]>([])
  const [selectedMemberUserIds, setSelectedMemberUserIds] = useState<string[]>([])
  const [imageUrl, setImageUrl] = useState("")

  useEffect(() => {
    if (currentUser) {
      setSelectedAdminUserIds((prevIds) => Array.from(new Set([...prevIds, currentUser.id])))
      setSelectedMemberUserIds((prevIds) => Array.from(new Set([...prevIds, currentUser.id])))
    }
  }, [currentUser])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      alert("Subgroup Name is required.")
      return
    }
    onSubmit({
      name,
      summary,
      locationCity,
      venue,
      details,
      chapterIds: selectedChapterIds,
      adminUserIds: selectedAdminUserIds,
      memberUserIds: selectedMemberUserIds,
      imageUrl,
    })
  }

  const chapterSelectableItems: EntitySelectItem[] = mockChapters.map((chapter) => ({
    id: chapter.id,
    name: chapter.name,
    details: chapter.location?.city,
  }))

  const userSelectableItems: EntitySelectItem[] = mockUsers.map((user) => ({
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    fallback: user.name.substring(0, 2).toUpperCase(),
    details: user.username ? `@${user.username}` : undefined,
  }))

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <ScrollArea className="flex-grow pr-1">
        <div className="space-y-3 py-3">
          <div className="space-y-1">
            <Label htmlFor="subgroup-name">
              Subgroup Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="subgroup-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter subgroup name"
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="subgroup-summary">Summary</Label>
            <Textarea
              id="subgroup-summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="A brief summary (1-2 sentences)"
              className="h-20"
            />
          </div>
          <EntityMultiSelect
            label="Chapter Associations"
            items={chapterSelectableItems}
            selectedIds={selectedChapterIds}
            onSelectionChange={setSelectedChapterIds}
            searchPlaceholder="Search chapters..."
            listHeight="h-[120px]"
          />
          <EntityMultiSelect
            label="Administrators"
            items={userSelectableItems}
            selectedIds={selectedAdminUserIds}
            onSelectionChange={setSelectedAdminUserIds}
            searchPlaceholder="Search users to add as admins..."
            listHeight="h-[120px]"
          />
          <EntityMultiSelect
            label="Initial Members"
            items={userSelectableItems}
            selectedIds={selectedMemberUserIds}
            onSelectionChange={setSelectedMemberUserIds}
            searchPlaceholder="Search users to add as members..."
            listHeight="h-[120px]"
          />
          <div className="space-y-1">
            <Label htmlFor="subgroup-location">Location (e.g., City or Online)</Label>
            <Input
              id="subgroup-location"
              value={locationCity}
              onChange={(e) => setLocationCity(e.target.value)}
              placeholder="e.g., San Francisco / Online"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="subgroup-venue">Venue (if applicable)</Label>
            <Input
              id="subgroup-venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g., Community Hall Room A / Zoom Link"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="subgroup-details">Details</Label>
            <Textarea
              id="subgroup-details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="More detailed information about the subgroup"
              className="h-24"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="subgroup-imageUrl">Image URL (Optional)</Label>
            <Input
              id="subgroup-imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.png"
            />
          </div>
        </div>
      </ScrollArea>
      <div className="flex justify-end gap-2 pt-3 border-t mt-auto">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!name.trim()}>
          Create Subgroup
        </Button>
      </div>
    </form>
  )
}
