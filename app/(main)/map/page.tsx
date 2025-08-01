"use client"

import { useState, useEffect } from "react"
import { MapPin, Calendar, Users, Search, Filter, X, ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { chapters, groups, projects } from "@/lib/mock-data"

export default function MapPage() {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [selectedChapter, setSelectedChapter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["event", "group"])
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("all")
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  // Filter events for different timeframes
  const now = new Date()
  const oneWeekLater = new Date(now)
  oneWeekLater.setDate(now.getDate() + 7)

  const oneMonthLater = new Date(now)
  oneMonthLater.setMonth(now.getMonth() + 1)

  const threeMonthsLater = new Date(now)
  threeMonthsLater.setMonth(now.getMonth() + 3)

  const filteredEvents = projects.filter((event) => {
    const eventDate = new Date(event.startDate || event.timeframe?.start || Date.now())
    const isInChapter = selectedChapter === "all" || (event.chapterTags || []).includes(selectedChapter)
    const matchesSearch =
      (event.title || event.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description || "").toLowerCase().includes(searchQuery.toLowerCase())

    let isInTimeRange = true
    if (selectedTimeframe === "week") {
      isInTimeRange = eventDate >= now && eventDate <= oneWeekLater
    } else if (selectedTimeframe === "month") {
      isInTimeRange = eventDate >= now && eventDate <= oneMonthLater
    } else if (selectedTimeframe === "three_months") {
      isInTimeRange = eventDate >= now && eventDate <= threeMonthsLater
    }

    return isInChapter && matchesSearch && isInTimeRange && selectedTypes.includes("event")
  })

  // Filter groups by chapter and search
  const filteredGroups = groups.filter((group) => {
    const isInChapter =
      selectedChapter === "all" || (group.chapters || group.chapterTags || []).includes(selectedChapter)
    const matchesSearch =
      (group.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (group.description || "").toLowerCase().includes(searchQuery.toLowerCase())
    return isInChapter && matchesSearch && selectedTypes.includes("group")
  })

  // Combine events and groups for map display
  const mapItems = [
    ...filteredEvents.map((event) => {
      // Extract the address string properly
      let addressString = "Unknown Location"

      if (typeof event.location === "string") {
        addressString = event.location
      } else if (event.location && typeof event.location === "object" && "address" in event.location) {
        addressString = event.location.address
      } else if (event.chapterTags && event.chapterTags.length > 0) {
        addressString = chapters.find((c) => c.id === event.chapterTags[0])?.name || "Unknown Location"
      }

      return {
        id: event.id,
        type: "event",
        name: event.title || event.name || "Unnamed Event",
        description: event.description || "",
        location: {
          address: addressString,
        },
        timeframe: {
          start: event.startDate || event.timeframe?.start || new Date().toISOString(),
          end: event.endDate || event.timeframe?.end || new Date().toISOString(),
        },
        image: event.image || "/placeholder.svg",
        tags: event.chapterTags || [],
        url: `/events/${event.id}`,
      }
    }),
    ...filteredGroups.map((group) => ({
      id: group.id,
      type: "group",
      name: group.name || "Unnamed Group",
      description: group.description || "",
      location: {
        address:
          (group.chapters || group.chapterTags || [])
            .map((tag) => chapters.find((c) => c.id === tag)?.name || tag)
            .join(", ") || "Multiple locations",
      },
      image: group.avatar || "/placeholder.svg",
      tags: group.chapterTags || [],
      memberCount: (group.members || []).length,
      url: `/groups/${group.id}`,
    })),
  ]

  // Filter items based on selected tab
  const displayedItems =
    selectedTab === "all"
      ? mapItems
      : selectedTab === "events"
        ? mapItems.filter((item) => item.type === "event")
        : mapItems.filter((item) => item.type === "group")

  useEffect(() => {
    // In a real app, this would initialize a map library like Google Maps or Mapbox
    const timer = setTimeout(() => {
      setMapLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleChapterChange = (chapter: string) => {
    setSelectedChapter(chapter)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type))
    } else {
      setSelectedTypes([...selectedTypes, type])
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="p-4 border-b flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Map</h1>
          <div className="relative">
            <select
              className="appearance-none bg-white border rounded-md px-3 py-1 pr-8 focus:outline-none focus:ring-2 focus:ring-primary"
              value={selectedChapter}
              onChange={(e) => handleChapterChange(e.target.value)}
            >
              <option value="all">All Chapters</option>
              {chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-500" />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search locations..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="absolute right-2.5 top-2.5" onClick={() => setSearchQuery("")}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h3 className="font-medium">Filter Map Items</h3>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Type</h4>
                  <div className="flex gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="filter-events"
                        checked={selectedTypes.includes("event")}
                        onCheckedChange={() => toggleType("event")}
                      />
                      <label htmlFor="filter-events" className="text-sm">
                        Events
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="filter-groups"
                        checked={selectedTypes.includes("group")}
                        onCheckedChange={() => toggleType("group")}
                      />
                      <label htmlFor="filter-groups" className="text-sm">
                        Groups
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Timeframe</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "all", label: "All Time" },
                      { id: "week", label: "Next Week" },
                      { id: "month", label: "Next Month" },
                      { id: "three_months", label: "Next 3 Months" },
                    ].map((option) => (
                      <Button
                        key={option.id}
                        variant={selectedTimeframe === option.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTimeframe(option.id)}
                        className="text-xs h-8"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="relative flex-1 h-full overflow-hidden">
        {mapLoaded ? (
          <div className="absolute inset-0 bg-gray-100">
            {/* This would be replaced with an actual map component */}
            <div className="h-full w-full flex items-center justify-center">
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">
                  Map with {displayedItems.length} locations in{" "}
                  {selectedChapter === "all" ? "all chapters" : chapters.find((c) => c.id === selectedChapter)?.name}
                </p>
                <div className="flex justify-center gap-2">
                  {selectedTypes.includes("event") && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Events: {filteredEvents.length}
                    </Badge>
                  )}
                  {selectedTypes.includes("group") && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> Groups: {filteredGroups.length}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Map markers would be rendered here in a real implementation */}
            <div className="absolute inset-0 pointer-events-none">
              {displayedItems.map((item, index) => (
                <div
                  key={item.id}
                  className="absolute"
                  style={{
                    left: `${20 + ((index * 5) % 80)}%`,
                    top: `${15 + ((index * 7) % 70)}%`,
                  }}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shadow-md transform transition-transform",
                      item.type === "event" ? "bg-primary" : "bg-blue-500",
                      hoveredItem === item.id && "scale-125",
                    )}
                  >
                    {item.type === "event" ? (
                      <Calendar className="h-4 w-4 text-white" />
                    ) : (
                      <Users className="h-4 w-4 text-white" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-100">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-8 bg-gray-300 rounded-full mb-2"></div>
              <div className="h-4 w-32 bg-gray-300 rounded"></div>
            </div>
          </div>
        )}

        <div className="absolute bottom-4 left-0 right-0 px-4 z-10">
          <div className="bg-white rounded-lg shadow-lg p-2 max-h-[240px]">
            <div className="flex justify-between items-center mb-2 px-2">
              <h3 className="font-medium">Locations ({displayedItems.length})</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)} className="h-8 px-2">
                {showFilters ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex overflow-x-auto pb-4 px-2 gap-3 snap-x snap-mandatory">
              {displayedItems.slice(0, showFilters ? 3 : 6).map((item) => (
                <Link
                  href={item.url}
                  key={item.id}
                  className="bg-white rounded-lg border hover:border-primary transition-colors overflow-hidden flex flex-col min-w-[280px] w-[280px] snap-start"
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="relative h-24 w-full">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    <div
                      className={cn(
                        "absolute top-2 left-2 rounded-full w-6 h-6 flex items-center justify-center",
                        item.type === "event" ? "bg-primary" : "bg-blue-500",
                      )}
                    >
                      {item.type === "event" ? (
                        <Calendar className="h-3 w-3 text-white" />
                      ) : (
                        <Users className="h-3 w-3 text-white" />
                      )}
                    </div>
                  </div>
                  <div className="p-3 flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{item.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <p className="truncate">{item.location.address || "Unknown location"}</p>
                    </div>
                    {item.type === "event" && "timeframe" in item && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3 shrink-0" />
                        <p>{formatDate(item.timeframe.start)}</p>
                      </div>
                    )}
                    {item.type === "group" && "memberCount" in item && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Users className="h-3 w-3 shrink-0" />
                        <p>{item.memberCount || 0} members</p>
                      </div>
                    )}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {item.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                            {tag}
                          </Badge>
                        ))}
                        {item.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs px-1 py-0">
                            +{item.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ))}

              {displayedItems.length > (showFilters ? 3 : 6) && (
                <div className="flex items-center justify-center min-w-[280px] w-[280px] border border-dashed rounded-lg">
                  <Button variant="ghost" size="sm" className="h-full w-full">
                    View all {displayedItems.length} locations
                  </Button>
                </div>
              )}

              {displayedItems.length === 0 && (
                <div className="text-center py-6 text-muted-foreground w-full">
                  <p>No locations found matching your criteria</p>
                  <Button
                    variant="link"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedTypes(["event", "group"])
                      setSelectedTimeframe("all")
                    }}
                  >
                    Reset filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
