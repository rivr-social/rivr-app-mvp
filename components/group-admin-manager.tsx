"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Shield, ShieldAlert, UserPlus, X, Search, Check } from "lucide-react"
import { users } from "@/lib/mock-data"

interface GroupAdminManagerProps {
  groupId: string
  members: string[]
  admins: string[]
  creator: string
  onAdminChange: (admins: string[]) => void
}

export function GroupAdminManager({
  groupId,
  members = [],
  admins = [],
  creator,
  onAdminChange,
}: GroupAdminManagerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])

  // Get member users that are not already admins
  const memberUsers = users.filter((user) => members?.includes(user.id) && !admins.includes(user.id))

  // Get admin users
  const adminUsers = users.filter((user) => admins?.includes(user.id))

  // Get creator user
  const creatorUser = users.find((user) => user.id === creator)

  // Filter members based on search query
  const filteredMembers = memberUsers.filter(
    (user) =>
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleToggleSelect = (userId: string) => {
    setSelectedMembers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handleMakeAdmins = () => {
    const newAdmins = [...admins, ...selectedMembers]
    onAdminChange(newAdmins)
    setSelectedMembers([])
  }

  const handleRemoveAdmin = (adminId: string) => {
    // Don't allow removing the creator
    if (adminId === creator) {
      alert("The creator cannot be removed from admin status.")
      return
    }

    const newAdmins = admins.filter((id) => id !== adminId)
    onAdminChange(newAdmins)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShieldAlert className="h-5 w-5 mr-2 text-amber-500" />
          Group Admins
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Current Admins</h3>
            <div className="space-y-2">
              {/* Creator */}
              {creatorUser && (
                <div className="flex items-center justify-between p-2 rounded-md bg-amber-50 border border-amber-200">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={creatorUser.avatar || "/placeholder.svg"} alt={creatorUser.name} />
                      <AvatarFallback>{creatorUser.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{creatorUser.name}</p>
                      <div className="flex items-center">
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                          Creator
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Other admins */}
              {adminUsers
                .filter((user) => user.id !== creator)
                .map((admin) => (
                  <div key={admin.id} className="flex items-center justify-between p-2 rounded-md border">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={admin.avatar || "/placeholder.svg"} alt={admin.name} />
                        <AvatarFallback>{admin.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{admin.name}</p>
                        <div className="flex items-center">
                          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveAdmin(admin.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-2">Add New Admins</h3>
            <div className="flex items-center mb-2">
              <Search className="h-4 w-4 mr-2 text-muted-foreground" />
              <Input
                placeholder="Search for members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>

            {filteredMembers.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between p-2 rounded-md border ${
                      selectedMembers.includes(member.id) ? "bg-blue-50 border-blue-200" : ""
                    }`}
                    onClick={() => handleToggleSelect(member.id)}
                  >
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <p className="font-medium">{member.name}</p>
                    </div>
                    <div className="flex items-center">
                      {selectedMembers.includes(member.id) ? (
                        <Check className="h-5 w-5 text-blue-500" />
                      ) : (
                        <UserPlus className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-2">No members found</p>
            )}

            {selectedMembers.length > 0 && (
              <Button className="w-full mt-4" onClick={handleMakeAdmins}>
                Make {selectedMembers.length} {selectedMembers.length === 1 ? "Member" : "Members"} Admin
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
