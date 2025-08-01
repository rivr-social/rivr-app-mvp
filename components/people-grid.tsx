"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Grid, List, SlidersHorizontal, Search } from "lucide-react"
import Link from "next/link"

interface Person {
  id: string
  name: string
  username: string
  avatar?: string
  bio?: string
  chapterTags?: string[]
  groupTags?: string[]
  relationshipType?: string
}

interface PeopleGridProps {
  people: Person[]
  chapters?: Array<{ id: string; name: string }>
  groups?: Array<{ id: string; name: string }>
  relationshipTypes?: string[]
}

export function PeopleGrid({
  people,
  chapters = [],
  groups = [],
  relationshipTypes = ["All", "Following", "Followers", "Connections", "Collaborators"],
}: PeopleGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedChapter, setSelectedChapter] = useState<string>("all")
  const [selectedGroup, setSelectedGroup] = useState<string>("all")
  const [selectedRelationship, setSelectedRelationship] = useState<string>("All")

  // Filter people based on search and filters
  const filteredPeople = people.filter((person) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (person.bio && person.bio.toLowerCase().includes(searchQuery.toLowerCase()))

    // Chapter filter
    const matchesChapter =
      selectedChapter === "all" || (person.chapterTags && person.chapterTags.includes(selectedChapter))

    // Group filter
    const matchesGroup = selectedGroup === "all" || (person.groupTags && person.groupTags.includes(selectedGroup))

    // Relationship filter
    const matchesRelationship = selectedRelationship === "All" || person.relationshipType === selectedRelationship

    return matchesSearch && matchesChapter && matchesGroup && matchesRelationship
  })

  return (
    <div className="space-y-4">
      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search people..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
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
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

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
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredPeople.length} of {people.length} people
      </div>

      {/* Grid view */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredPeople.map((person) => (
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
      {viewMode === "list" && (
        <div className="space-y-2">
          {filteredPeople.map((person) => (
            <Card key={person.id} className="overflow-hidden">
              <CardContent className="p-3">
                <Link href={`/profile/${person.username}`} className="flex items-center gap-3 group">
                  <Avatar className="h-12 w-12 border-2 border-background group-hover:border-primary transition-all">
                    <AvatarImage src={person.avatar || "/placeholder.svg"} alt={person.name} />
                    <AvatarFallback>{person.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium group-hover:text-primary transition-colors">{person.name}</div>
                    <div className="text-sm text-muted-foreground">@{person.username}</div>
                    {person.bio && <div className="text-sm line-clamp-1">{person.bio}</div>}
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {filteredPeople.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No people found matching your filters</p>
        </div>
      )}
    </div>
  )
}
