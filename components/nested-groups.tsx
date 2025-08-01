"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Layers, ChevronRight, Users, FolderPlus } from "lucide-react"
import { groups } from "@/lib/mock-data"
import Link from "next/link"

interface NestedGroupsProps {
  parentGroupId: string
  isCreator: boolean
  isAdmin: boolean
}

export function NestedGroups({ parentGroupId, isCreator, isAdmin }: NestedGroupsProps) {
  const [isAddingGroup, setIsAddingGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDescription, setNewGroupDescription] = useState("")

  // Get parent group
  const parentGroup = groups.find((g) => g.id === parentGroupId)

  // Get child groups
  const childGroups = groups.filter((g) => g.parentGroup === parentGroupId)

  const handleAddGroup = () => {
    // In a real app, this would create a new group
    alert(`New subgroup "${newGroupName}" would be created under ${parentGroup?.name}`)
    setIsAddingGroup(false)
    setNewGroupName("")
    setNewGroupDescription("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Layers className="h-5 w-5 mr-2 text-primary" />
            Subgroups
          </div>
          {(isCreator || isAdmin) && (
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Create Subgroup
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a New Subgroup</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-1">
                      Subgroup Name
                    </label>
                    <Input
                      id="groupName"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      placeholder="Enter subgroup name"
                    />
                  </div>
                  <div>
                    <label htmlFor="groupDescription" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Input
                      id="groupDescription"
                      value={newGroupDescription}
                      onChange={(e) => setNewGroupDescription(e.target.value)}
                      placeholder="Enter subgroup description"
                    />
                  </div>
                  <Button className="w-full" onClick={handleAddGroup}>
                    Create Subgroup
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {childGroups.length > 0 ? (
          <div className="space-y-3">
            {childGroups.map((group) => (
              <Link href={`/groups/${group.id}`} key={group.id}>
                <div className="flex items-center justify-between p-3 rounded-md border hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={group.avatar || "/placeholder.svg"} alt={group.name} />
                      <AvatarFallback>{group.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{group.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{group.members.length} members</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>No subgroups yet</p>
            {(isCreator || isAdmin) && <p className="text-sm mt-1">Create a subgroup to organize your community</p>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
