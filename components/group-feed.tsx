"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { TypeBadge } from "@/components/type-badge"
import { TypeIcon } from "@/components/type-icon"
import Link from "next/link"
import { groups as mockGroups, users as mockUsers } from "@/lib/mock-data"

interface User {
  id: string
  name: string
  username: string
  avatar?: string
}

interface Group {
  id: string
  name: string
  description: string
  members: string[]
  avatar?: string
  location?: {
    lat: number
    lng: number
    city?: string
  }
  chapterTags?: string[]
  groupTags?: string[]
  venue?: string
}

interface GroupFeedProps {
  groups?: Group[]
  getMembers?: (memberIds: string[]) => User[]
  onJoinGroup?: (groupId: string) => void
  initialJoinedGroups?: string[]
  maxGroups?: number
  query?: string
  chapterId?: string
}

export function GroupFeed({
  groups,
  getMembers,
  onJoinGroup,
  initialJoinedGroups = [],
  maxGroups,
  query = "",
  chapterId = "all",
}: GroupFeedProps) {
  const [joinedGroups, setJoinedGroups] = useState<string[]>(initialJoinedGroups)
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([])

  // If groups is not provided, use mock data
  useEffect(() => {
    let groupsToUse = groups || mockGroups

    // Filter by query if provided
    if (query) {
      const lowerQuery = query.toLowerCase()
      groupsToUse = groupsToUse.filter(
        (group) =>
          group.name.toLowerCase().includes(lowerQuery) || group.description.toLowerCase().includes(lowerQuery),
      )
    }

    // Filter by chapter if provided and not "all"
    if (chapterId && chapterId !== "all") {
      groupsToUse = groupsToUse.filter((group) => group.chapterTags?.includes(chapterId))
    }

    // Apply maxGroups limit if provided
    if (maxGroups) {
      groupsToUse = groupsToUse.slice(0, maxGroups)
    }

    setFilteredGroups(groupsToUse)
  }, [groups, query, chapterId, maxGroups])

  const handleJoinGroup = (groupId: string) => {
    const newJoinedGroups = joinedGroups.includes(groupId)
      ? joinedGroups.filter((id) => id !== groupId)
      : [...joinedGroups, groupId]

    setJoinedGroups(newJoinedGroups)

    if (onJoinGroup) {
      onJoinGroup(groupId)
    }
  }

  // Default getMembers function if not provided
  const defaultGetMembers = (memberIds: string[]) => {
    return memberIds.map((id) => {
      const user = mockUsers.find((u) => u.id === id)
      return (
        user || {
          id,
          name: "Unknown User",
          username: "unknown",
        }
      )
    })
  }

  const getMembersFunction = getMembers || defaultGetMembers

  return (
    <div className="space-y-4 mt-4">
      {filteredGroups.map((group) => {
        // Get location - prioritize venue, then city
        const locationText = group.venue || group.location?.city || "Location not specified"

        return (
          <Card key={group.id} className="border shadow-sm overflow-hidden">
            <div className="flex">
              {/* Large image on left */}
              <div className="w-48 h-32 flex-shrink-0">
                <img
                  src={group.avatar || "/placeholder.svg?height=128&width=192"}
                  alt={group.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content on right */}
              <div className="flex-1 p-4">
                <div className="flex items-center justify-between mb-3">
                  <Link href={`/groups/${group.id}`} className="text-lg font-semibold hover:underline">
                    {group.name}
                  </Link>
                  <div className="flex items-center">
                    <TypeIcon type="group" size={16} className="mr-1" />
                    <TypeBadge type="group" showIcon={false} />
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-group" />
                  <span>{locationText}</span>
                </div>
              </div>
            </div>
          </Card>
        )
      })}

      {filteredGroups.length === 0 && <div className="text-center py-8 text-muted-foreground">No groups found</div>}
    </div>
  )
}
