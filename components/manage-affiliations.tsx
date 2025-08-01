"use client"

import { useState } from "react"
import type { Group } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ManageAffiliationsProps {
  currentGroup: Group
  allGroups: Group[]
  onAddAffiliation: (groupId: string) => void
  onCancel: () => void
}

export function ManageAffiliations({ currentGroup, allGroups, onAddAffiliation, onCancel }: ManageAffiliationsProps) {
  const [selectedGroupId, setSelectedGroupId] = useState("")

  // Filter out groups that are already affiliated, the current group, and any parent/child groups
  const availableGroups = allGroups.filter(
    (g) =>
      g.id !== currentGroup.id &&
      g.id !== currentGroup.parentGroupId &&
      g.parentGroupId !== currentGroup.id &&
      !currentGroup.affiliatedGroupIds?.includes(g.id) &&
      !g.affiliatedGroupIds?.includes(currentGroup.id),
  )

  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="group">Select Group to Affiliate With</Label>
        {availableGroups.length > 0 ? (
          <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a group..." />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-72">
                {availableGroups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
        ) : (
          <p className="text-sm text-muted-foreground">No available groups to affiliate with.</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() => onAddAffiliation(selectedGroupId)}
          disabled={!selectedGroupId || availableGroups.length === 0}
        >
          Add Affiliation
        </Button>
      </div>
    </div>
  )
}
