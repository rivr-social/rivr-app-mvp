"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Award, MapPin, Grid, List, SlidersHorizontal, Search, Users } from "lucide-react"
import { TypeBadge } from "@/components/type-badge"
import { TypeIcon } from "@/components/type-icon"
import Link from "next/link"

// Define the Person interface
export interface Person {
  id: string
  name: string
  username: string
  avatar?: string
  bio: string
  skills: string[]
  points: number
  location?: {
    city?: string
    state?: string
    lat?: number
    lng?: number
  }
  chapterTags?: string[]
  groupTags?: string[]
  relationshipType?: string
}

// Define the Chapter and Group interfaces
export interface Chapter {
  id: string
  name: string
}

export interface Group {
  id: string
  name: string
}

// Define the props for the PeopleModule component
export interface PeopleModuleProps {
  people: Person[]
  chapters?: Chapter[]
  groups?: Group[]
  relationshipTypes?: string[]
  initialViewMode?: "grid" | "list"
  initialTab?: string
  showTabs?: boolean
  showFilters?: boolean
  showSearch?: boolean
  showViewToggle?: boolean
  onConnect?: (personId: string) => void
  initialConnections?: string[]
  title?: string
  subtitle?: string
  className?: string
  maxPeople?: number
  emptyStateMessage?: string
  loading?: boolean
}

export function PeopleModule({
  people,
  chapters = [],
  groups = [],
  relationshipTypes = ["All", "Following", "Followers", "Connections", "Collaborators"],
  initialViewMode = "grid", // Default to grid view (avatar view)
  initialTab = "all",
  showTabs = false,
  showFilters = true,
  showSearch = true,
  showViewToggle = true,
  onConnect,
  initialConnections = [],
  title,
  subtitle,
  className = "",
  maxPeople,
  emptyStateMessage = "No people found",
  loading = false,
}: PeopleModuleProps) {
  // State
  const [viewMode, setViewMode] = useState<"grid" | "list">(initialViewMode)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedChapter, setSelectedChapter] = useState<string>("all")
  const [selectedGroup, setSelectedGroup] = useState<string>("all")
  const [selectedRelationship, setSelectedRelationship] = useState<string>("All")
  const [activeTab, setActiveTab] = useState(initialTab)
  const [connections, setConnections] = useState<string[]>(initialConnections)

  // Prepare data for different tabs
  const allPeople = people
  const followingPeople = people.filter((person) => person.relationshipType === "Following")
  const followersPeople = people.filter((person) => person.relationshipType === "Followers")
  const connectionsPeople = people.filter(
    (person) => person.relationshipType === "Connections" || connections.includes(person.id),
  )
  const collaboratorsPeople = people.filter((person) => person.relationshipType === "Collaborators")

  // Get the current tab's people
  const getCurrentTabPeople = () => {
    switch (activeTab) {
      case "following":
        return followingPeople
      case "followers":
        return followersPeople
      case "connections":
        return connectionsPeople
      case "collaborators":
        return collaboratorsPeople
      default:
        return allPeople
    }
  }

  // Filter people based on search and filters
  const filterPeople = (peopleToFilter: Person[]) => {
    return peopleToFilter.filter((person) => {
      // Search filter
      const matchesSearch =
        !showSearch ||
        searchQuery === "" ||
        person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.bio.toLowerCase().includes(searchQuery.toLowerCase())

      // Chapter filter
      const matchesChapter =
        !showFilters ||
        selectedChapter === "all" ||
        (person.chapterTags && person.chapterTags.includes(selectedChapter))

      // Group filter
      const matchesGroup =
        !showFilters || selectedGroup === "all" || (person.groupTags && person.groupTags.includes(selectedGroup))

      // Relationship filter
      const matchesRelationship =
        !showFilters || selectedRelationship === "All" || person.relationshipType === selectedRelationship

      return matchesSearch && matchesChapter && matchesGroup && matchesRelationship
    })
  }

  // Get filtered people for the current tab
  const filteredPeople = filterPeople(getCurrentTabPeople())

  // Apply maxPeople limit if provided
  const displayPeople = maxPeople ? filteredPeople.slice(0, maxPeople) : filteredPeople

  // Handle connect button click
  const handleConnect = (personId: string) => {
    const newConnections = connections.includes(personId)
      ? connections.filter((id) => id !== personId)
      : [...connections, personId]

    setConnections(newConnections)

    if (onConnect) {
      onConnect(personId)
    }
  }

  // Reset filters when tab changes
  useEffect(() => {
    if (showFilters) {
      setSelectedChapter("all")
      setSelectedGroup("all")
      setSelectedRelationship("All")
    }
  }, [activeTab, showFilters])

  return (
    <div className={className}>
      {/* Header with title and subtitle */}
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h2 className="text-2xl font-bold">{title}</h2>}
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
      )}

      {/* Tabs */}
      {showTabs && (
        <Tabs defaultValue={initialTab} className="w-full mb-4" onValueChange={setActiveTab}>
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${relationshipTypes.length}, 1fr)` }}>
            <TabsTrigger value="all">All</TabsTrigger>
            {relationshipTypes.includes("Following") && <TabsTrigger value="following">Following</TabsTrigger>}
            {relationshipTypes.includes("Followers") && <TabsTrigger value="followers">Followers</TabsTrigger>}
            {relationshipTypes.includes("Connections") && <TabsTrigger value="connections">Connections</TabsTrigger>}
            {relationshipTypes.includes("Collaborators") && (
              <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
            )}
          </TabsList>
        </Tabs>
      )}

      {/* Filters and search */}
      {(showFilters || showSearch || showViewToggle) && (
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
          {showSearch && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search people..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {showFilters && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <div className="p-2 space-y-2">
                    <div>
                      <p className="text-sm font-medium mb-1">Relationship</p>
                      <Select value={selectedRelationship} onValueChange={setSelectedRelationship}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="All relationships" />
                        </SelectTrigger>
                        <SelectContent>
                          {relationshipTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {chapters.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-1">Chapter</p>
                        <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="All chapters" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All chapters</SelectItem>
                            {chapters.map((chapter) => (
                              <SelectItem key={chapter.id} value={chapter.id}>
                                {chapter.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {groups.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-1">Group</p>
                        <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="All groups" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All groups</SelectItem>
                            {groups.map((group) => (
                              <SelectItem key={group.id} value={group.id}>
                                {group.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {showViewToggle && (
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  className="h-9 rounded-r-none"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  className="h-9 rounded-l-none"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results count */}
      {showFilters && (
        <div className="text-sm text-muted-foreground mb-4">
          Showing {displayPeople.length} of {getCurrentTabPeople().length} people
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center text-center animate-pulse">
              <div className="h-20 w-20 rounded-full bg-muted mb-2" />
              <div className="h-4 w-24 bg-muted rounded mb-1" />
              <div className="h-3 w-16 bg-muted rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Grid view */}
      {!loading && viewMode === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {displayPeople.map((person) => (
            <Link
              href={`/profile/${person.username}`}
              key={person.id}
              className="flex flex-col items-center text-center group"
            >
              <Avatar className="h-20 w-20 mb-2 border-2 border-background group-hover:border-primary transition-all">
                <AvatarImage src={person.avatar || "/placeholder.svg"} alt={person.name} />
                <AvatarFallback className="text-lg">{person.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="w-full truncate font-medium">{person.name}</div>
              <div className="w-full truncate text-xs text-muted-foreground">@{person.username}</div>
            </Link>
          ))}
        </div>
      )}

      {/* List view */}
      {!loading && viewMode === "list" && (
        <div className="space-y-2">
          {displayPeople.map((person) => {
            const isConnected = connections.includes(person.id)

            return (
              <Card key={person.id} className="overflow-hidden">
                <CardHeader className="p-4 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12 border-2 border-gray-200">
                        <AvatarImage src={person.avatar || "/placeholder.svg"} alt={person.name} />
                        <AvatarFallback>{person.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Link href={`/profile/${person.username}`} className="text-xl font-bold hover:underline">
                          {person.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">@{person.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <TypeIcon type="person" size={18} className="mr-2" />
                      <TypeBadge type="person" showIcon={false} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 bg-white">
                  <p className="text-muted-foreground mb-4">{person.bio}</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-person" />
                      <span>
                        {person.location?.city || "San Francisco"}, {person.location?.state || "CA"}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Award className="h-4 w-4 mr-2 text-person" />
                      <span>{person.points} points</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {person.skills.slice(0, 3).map((skill, i) => (
                        <Badge key={i} variant="outline" className="bg-gray-100 border-gray-200">
                          {skill}
                        </Badge>
                      ))}
                      {person.skills.length > 3 && (
                        <Badge variant="outline" className="bg-gray-100 border-gray-200">
                          +{person.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-end bg-gray-50">
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      handleConnect(person.id)
                    }}
                    className={isConnected ? "bg-gray-200 hover:bg-gray-300 text-gray-700" : ""}
                  >
                    {isConnected ? "Connected" : "Connect"}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}

      {/* Empty state */}
      {!loading && displayPeople.length === 0 && (
        <div className="text-center py-12 border rounded-md bg-muted/10">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">{emptyStateMessage}</p>
        </div>
      )}
    </div>
  )
}
