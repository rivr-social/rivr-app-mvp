"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Link2, ExternalLink, Users } from "lucide-react"
import { groups, groupRelationships } from "@/lib/mock-data"
import Link from "next/link"
import type { Group } from "@/lib/types"

interface GroupAffiliatesProps {
  groupId: string
}

export function GroupAffiliates({ groupId }: GroupAffiliatesProps) {
  // Get current group
  const currentGroup = groups.find((g) => g.id === groupId)
  if (!currentGroup) return null

  // Get all relationships where this group is involved (excluding parent-child)
  const relevantRelationships = groupRelationships.filter(
    (rel) => (rel.sourceGroupId === groupId || rel.targetGroupId === groupId) && rel.type !== "subgroup",
  )

  // Get all groups that have a relationship with this group
  const affiliatedGroupIds = new Set<string>()
  relevantRelationships.forEach((rel) => {
    if (rel.sourceGroupId === groupId) {
      affiliatedGroupIds.add(rel.targetGroupId)
    } else if (rel.targetGroupId === groupId) {
      affiliatedGroupIds.add(rel.sourceGroupId)
    }
  })

  // Get affiliated groups
  const affiliatedGroups = groups.filter((g) => affiliatedGroupIds.has(g.id))

  const getRelationshipType = (group: Group): string => {
    const relationship = relevantRelationships.find(
      (rel) =>
        (rel.sourceGroupId === groupId && rel.targetGroupId === group.id) ||
        (rel.sourceGroupId === group.id && rel.targetGroupId === groupId),
    )

    return relationship?.type || "affiliate"
  }

  const getRelationshipBadge = (type: string) => {
    switch (type) {
      case "affiliate":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Affiliate</Badge>
      case "partner":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Partner</Badge>
      case "coalition":
        return <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">Coalition</Badge>
      default:
        return <Badge variant="outline">Related</Badge>
    }
  }

  if (affiliatedGroups.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Link2 className="h-5 w-5 mr-2 text-primary" />
          Affiliated Groups
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {affiliatedGroups.map((group) => {
            const relationshipType = getRelationshipType(group)
            return (
              <Link href={`/groups/${group.id}`} key={group.id} className="block">
                <div className="flex items-center justify-between p-3 rounded-md border hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={group.avatar || "/placeholder.svg"} alt={group.name} />
                      <AvatarFallback>{group.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium mr-2">{group.name}</h3>
                        {getRelationshipBadge(relationshipType)}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{group.members.length} members</span>
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="h-5 w-5 text-muted-foreground" />
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
