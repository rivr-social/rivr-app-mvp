"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PlusCircle, Users, ArrowLeft, Layers, ChevronRight } from "lucide-react"
import type { Group, GroupRelationship } from "@/lib/types"
import { mockGroups, groupRelationships } from "@/lib/mock-data" // Ensure these are mutable for the demo
import { useAppContext } from "@/contexts/app-context"
import { SubgroupCreator, type SubgroupCreationData } from "./subgroup-creator"
import { EmptyState } from "@/components/empty-state"

interface GroupRelationshipsProps {
  group: Group
}

export function GroupRelationships({ group }: GroupRelationshipsProps) {
  const { state: appState } = useAppContext()
  const currentUser = appState.currentUser

  // Use local state for mock data to allow updates within the component session
  const [localMockGroups, setLocalMockGroups] = useState<Group[]>(() => [...mockGroups])
  const [localMockGroupRelationships, setLocalMockGroupRelationships] = useState<GroupRelationship[]>(() => [
    ...groupRelationships,
  ])

  const [isCreateSubgroupModalOpen, setIsCreateSubgroupModalOpen] = useState(false)

  const isGroupAdmin = useMemo(() => {
    if (!currentUser) return false
    return group.admins?.includes(currentUser.id) || group.creatorId === currentUser.id
  }, [group.admins, group.creatorId, currentUser])

  const subgroups = useMemo(() => {
    return localMockGroups.filter((g) => g.parentGroupId === group.id)
  }, [localMockGroups, group.id])

  const parentGroup = useMemo(() => {
    return group.parentGroupId ? localMockGroups.find((g) => g.id === group.parentGroupId) : null
  }, [localMockGroups, group.parentGroupId])

  const handleSubgroupCreated = (formData: SubgroupCreationData) => {
    if (!currentUser) {
      alert("You must be logged in to create a subgroup.")
      return
    }

    const newSubgroupId = `group-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    const adminIds = Array.from(new Set([...formData.adminUserIds, currentUser.id]))
    const memberIds = Array.from(new Set([...formData.memberUserIds, currentUser.id]))

    const newSubgroup: Group = {
      id: newSubgroupId,
      name: formData.name,
      summary: formData.summary,
      description: formData.details, // 'details' from form maps to 'description' in Group type
      venue: formData.venue,
      location: formData.locationCity ? { city: formData.locationCity } : undefined,
      avatar: formData.imageUrl || `/placeholder.svg?width=100&height=100&query=${encodeURIComponent(formData.name)}`,
      chapterTags: formData.chapterIds,
      admins: adminIds,
      members: memberIds,
      creatorId: currentUser.id,
      parentGroupId: group.id,
      createdAt: new Date().toISOString(),
      isPublic: group.isPublic, // Inherit public status from parent, or make it configurable
      type: group.type, // Inherit type, or make it configurable
      color: group.color, // Inherit color, or make it configurable
    }

    // Update local state and the "global" mock data for this session
    setLocalMockGroups((prev) => [...prev, newSubgroup])
    mockGroups.push(newSubgroup) // Note: This mutates the imported mockData for the session

    const newRelationship: GroupRelationship = {
      sourceGroupId: group.id,
      targetGroupId: newSubgroupId,
      type: "subgroup",
      createdAt: new Date().toISOString(),
      createdBy: currentUser.id,
    }
    setLocalMockGroupRelationships((prev) => [...prev, newRelationship])
    groupRelationships.push(newRelationship) // Note: Mutates imported mockData

    setIsCreateSubgroupModalOpen(false)
  }

  return (
    <div className="space-y-4">
      {parentGroup && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base font-semibold">
              <ArrowLeft className="h-4 w-4 mr-2 text-muted-foreground" />
              Parent Group
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href={`/groups/${parentGroup.id}`} className="block -m-3">
              <div className="flex items-center justify-between p-3 rounded-md hover:bg-accent cursor-pointer transition-colors">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={
                        parentGroup.avatar || `/placeholder.svg?width=40&height=40&query=${parentGroup.name.charAt(0)}`
                      }
                      alt={parentGroup.name}
                    />
                    <AvatarFallback style={{ backgroundColor: parentGroup.color }}>
                      {parentGroup.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-sm">{parentGroup.name}</h3>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Users className="h-3 w-3 mr-1" />
                      <span>{parentGroup.members?.length || 0} members</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center">
            <Layers className="h-5 w-5 mr-2 text-primary" />
            <CardTitle className="text-base font-semibold">Subgroups</CardTitle>
          </div>
          {isGroupAdmin && (
            <Dialog open={isCreateSubgroupModalOpen} onOpenChange={setIsCreateSubgroupModalOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <PlusCircle className="h-4 w-4 mr-1.5" />
                  Create
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg w-[90vw] h-[90vh] p-0 flex flex-col sm:max-w-xl md:max-w-2xl">
                <DialogHeader className="p-4 border-b">
                  <DialogTitle className="text-lg">Create New Subgroup</DialogTitle>
                  <DialogDescription>For "{group.name}"</DialogDescription>
                </DialogHeader>
                <div className="flex-grow overflow-hidden p-4">
                  <SubgroupCreator
                    parentGroupId={group.id}
                    parentGroup={group}
                    onSubmit={handleSubgroupCreated}
                    onCancel={() => setIsCreateSubgroupModalOpen(false)}
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
          {subgroups.length > 0 ? (
            <div className="space-y-2">
              {subgroups.map((subgroupItem) => (
                <Link href={`/groups/${subgroupItem.id}`} key={subgroupItem.id} className="block">
                  <div className="flex items-center justify-between p-2.5 rounded-md border hover:bg-accent cursor-pointer transition-colors">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={
                            subgroupItem.avatar ||
                            `/placeholder.svg?width=36&height=36&query=${subgroupItem.name.charAt(0) || "/placeholder.svg"}`
                          }
                          alt={subgroupItem.name}
                        />
                        <AvatarFallback style={{ backgroundColor: subgroupItem.color }}>
                          {subgroupItem.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-sm">{subgroupItem.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {subgroupItem.summary || subgroupItem.description}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{subgroupItem.members?.length || 0} members</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Layers className="h-10 w-10 text-muted-foreground" />}
              title="No Subgroups Yet"
              description={
                isGroupAdmin
                  ? "Create a subgroup to further organize your community."
                  : "This group doesn't have any subgroups."
              }
              action={
                isGroupAdmin && (
                  <Button onClick={() => setIsCreateSubgroupModalOpen(true)} variant="default" size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create First Subgroup
                  </Button>
                )
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
