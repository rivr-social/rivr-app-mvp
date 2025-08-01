"use client"

import { useState, useEffect } from "react"
import { Search, Grid3X3, List } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/lib/types"
import { mockUsers } from "@/lib/mock-data"
import { EmptyState } from "@/components/empty-state"

interface PeopleModuleProps {
  users?: User[]
  initialTab?: string
  initialViewMode?: "grid" | "list"
  showTabs?: boolean
  showFilters?: boolean
  showSearch?: boolean
  showViewToggle?: boolean
  relationshipTypes?: string[]
  emptyStateMessage?: string
  title?: string
}

export function PeopleModule({
  users = mockUsers,
  initialTab = "all",
  initialViewMode = "grid",
  showTabs = true,
  showFilters = false,
  showSearch = true,
  showViewToggle = true,
  relationshipTypes = ["all", "following", "followers", "connections", "collaborators"],
  emptyStateMessage = "No people found",
  title,
}: PeopleModuleProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">(initialViewMode)
  const [activeTab, setActiveTab] = useState(initialTab)
  const [searchQuery, setSearchQuery] = useState("")
  const [relationshipFilter, setRelationshipFilter] = useState("all")
  const [chapterFilter, setChapterFilter] = useState("all")
  const [groupFilter, setGroupFilter] = useState("all")
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users)

  useEffect(() => {
    let result = [...users]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.username.toLowerCase().includes(query) ||
          (user.bio && user.bio.toLowerCase().includes(query)),
      )
    }

    // Apply relationship filter based on active tab
    if (activeTab !== "all") {
      result = result.filter((user) => {
        switch (activeTab) {
          case "following":
            return user.isFollowing
          case "followers":
            return user.isFollower
          case "connections":
            return user.isConnection
          case "collaborators":
            return user.isCollaborator
          default:
            return true
        }
      })
    }

    // Apply additional filters
    if (relationshipFilter !== "all") {
      result = result.filter((user) => {
        switch (relationshipFilter) {
          case "following":
            return user.isFollowing
          case "followers":
            return user.isFollower
          case "connections":
            return user.isConnection
          case "collaborators":
            return user.isCollaborator
          default:
            return true
        }
      })
    }

    if (chapterFilter !== "all") {
      result = result.filter((user) => user.chapters && user.chapters.some((chapter) => chapter.id === chapterFilter))
    }

    if (groupFilter !== "all") {
      result = result.filter((user) => user.groups && user.groups.some((group) => group.id === groupFilter))
    }

    setFilteredUsers(result)
  }, [users, searchQuery, activeTab, relationshipFilter, chapterFilter, groupFilter])

  const renderGridView = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {filteredUsers.map((user) => (
        <div key={user.id} className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 mb-2">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="font-medium truncate w-full">{user.name}</div>
          <div className="text-sm text-muted-foreground truncate w-full">@{user.username}</div>
          {user.isFollowing && (
            <Badge variant="outline" className="mt-1">
              Following
            </Badge>
          )}
        </div>
      ))}
    </div>
  )

  const renderListView = () => (
    <div className="space-y-4">
      {filteredUsers.map((user) => (
        <Card key={user.id}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-muted-foreground">@{user.username}</div>
                {user.bio && <p className="text-sm mt-1 truncate">{user.bio}</p>}
              </div>
              <Button variant="outline" size="sm">
                {user.isFollowing ? "Following" : "Follow"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderFilters = () => (
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <Select value={relationshipFilter} onValueChange={setRelationshipFilter}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Relationship" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Relationships</SelectItem>
          <SelectItem value="following">Following</SelectItem>
          <SelectItem value="followers">Followers</SelectItem>
          <SelectItem value="connections">Connections</SelectItem>
          <SelectItem value="collaborators">Collaborators</SelectItem>
        </SelectContent>
      </Select>

      <Select value={chapterFilter} onValueChange={setChapterFilter}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Chapter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Chapters</SelectItem>
          <SelectItem value="boston">Boston</SelectItem>
          <SelectItem value="nyc">New York</SelectItem>
          <SelectItem value="sf">San Francisco</SelectItem>
        </SelectContent>
      </Select>

      <Select value={groupFilter} onValueChange={setGroupFilter}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Group" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Groups</SelectItem>
          <SelectItem value="group1">Climate Action</SelectItem>
          <SelectItem value="group2">Urban Gardening</SelectItem>
          <SelectItem value="group3">Tech for Good</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )

  return (
    <div className="space-y-4">
      {title && <h2 className="text-xl font-semibold">{title}</h2>}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {showSearch && (
          <div className="relative w-full sm:w-auto sm:flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search people..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {showViewToggle && (
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {showFilters && renderFilters()}

      {showTabs ? (
        <Tabs defaultValue={initialTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full sm:w-auto">
            {relationshipTypes.map((type) => (
              <TabsTrigger key={type} value={type} className="capitalize">
                {type}
              </TabsTrigger>
            ))}
          </TabsList>

          {relationshipTypes.map((type) => (
            <TabsContent key={type} value={type}>
              {filteredUsers.length > 0 ? (
                viewMode === "grid" ? (
                  renderGridView()
                ) : (
                  renderListView()
                )
              ) : (
                <EmptyState title="No people found" description={emptyStateMessage} icon="users" />
              )}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <>
          {filteredUsers.length > 0 ? (
            viewMode === "grid" ? (
              renderGridView()
            ) : (
              renderListView()
            )
          ) : (
            <EmptyState title="No people found" description={emptyStateMessage} icon="users" />
          )}
        </>
      )}
    </div>
  )
}
