"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label" // Added Label
import { ScrollArea } from "@/components/ui/scroll-area" // Added ScrollArea
import { EntityMultiSelect, type EntitySelectItem } from "@/components/entity-multi-select" // Added EntityMultiSelect
import { mockUsers, chapters as mockChapters } from "@/lib/mock-data" // Added mock data
import { useAppContext } from "@/contexts/app-context" // Added AppContext

export default function CreatePage() {
  const router = useRouter()
  const { state: appState } = useAppContext()
  const currentUser = appState.currentUser

  const [activeTab, setActiveTab] = useState("post") // Renamed from postType for clarity

  // Common state for image upload (simplified)
  const [imageUrl, setImageUrl] = useState("")

  // Post/Offer state
  const [offerType, setOfferType] = useState("offer") // 'offer' or 'request'
  const [postTitle, setPostTitle] = useState("")
  const [postDetails, setPostDetails] = useState("")
  const [postLocation, setPostLocation] = useState("")

  // Event state
  const [eventTitle, setEventTitle] = useState("")
  const [eventStartDate, setEventStartDate] = useState("")
  const [eventStartTime, setEventStartTime] = useState("")
  const [eventEndDate, setEventEndDate] = useState("")
  const [eventEndTime, setEventEndTime] = useState("")
  const [eventLocation, setEventLocation] = useState("")
  const [eventVenueName, setEventVenueName] = useState("")
  const [eventDetails, setEventDetails] = useState("")
  // Add state for event tickets if needed

  // Group state
  const [groupName, setGroupName] = useState("")
  const [groupSummary, setGroupSummary] = useState("")
  const [groupLocationCity, setGroupLocationCity] = useState("")
  const [groupVenue, setGroupVenue] = useState("")
  const [groupDetails, setGroupDetails] = useState("")
  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>([])
  const [selectedAdminUserIds, setSelectedAdminUserIds] = useState<string[]>([])
  const [selectedMemberUserIds, setSelectedMemberUserIds] = useState<string[]>([])

  useEffect(() => {
    if (currentUser) {
      setSelectedAdminUserIds((prevIds) => Array.from(new Set([...prevIds, currentUser.id])))
      setSelectedMemberUserIds((prevIds) => Array.from(new Set([...prevIds, currentUser.id])))
    }
  }, [currentUser])

  const chapterSelectableItems: EntitySelectItem[] = mockChapters.map((chapter) => ({
    id: chapter.id,
    name: chapter.name,
    details: chapter.location?.city,
  }))

  const userSelectableItems: EntitySelectItem[] = mockUsers.map((user) => ({
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    fallback: user.name.substring(0, 2).toUpperCase(),
    details: user.username ? `@${user.username}` : undefined,
  }))

  const handleCreate = () => {
    // Logic to create post, event, or group based on activeTab and state
    console.log("Creating:", {
      activeTab,
      // post data
      offerType,
      postTitle,
      postDetails,
      postLocation,
      // event data
      eventTitle,
      eventStartDate,
      eventStartTime,
      eventEndDate,
      eventEndTime,
      eventLocation,
      eventVenueName,
      eventDetails,
      // group data
      groupName,
      groupSummary,
      groupLocationCity,
      groupVenue,
      groupDetails,
      selectedChapterIds,
      selectedAdminUserIds,
      selectedMemberUserIds,
      imageUrl,
    })
    // Potentially navigate away or show success message
    // router.push('/'); // Example navigation
  }

  return (
    <div className="container max-w-2xl mx-auto px-0 sm:px-4 py-6">
      <div className="flex items-center justify-between mb-6 px-4 sm:px-0">
        <Button variant="ghost" size="icon" className="p-0 -ml-2 sm:ml-0" onClick={() => router.back()}>
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-xl font-semibold">Create New</h1>
        <Button onClick={handleCreate} disabled={activeTab === "group" && !groupName.trim()}>
          Post
        </Button>
      </div>

      <div className="flex items-center gap-3 mb-6 px-4 sm:px-0">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={currentUser?.avatar || "/placeholder.svg?width=40&height=40&query=User"}
            alt={currentUser?.name || "User"}
          />
          <AvatarFallback>{currentUser?.name?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{currentUser?.name || "Current User"}</p>
          {/* <p className="text-sm text-muted-foreground">Creating for: Everyone</p> */}
        </div>
      </div>

      <Tabs defaultValue="post" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 sticky top-0 z-10 bg-background border-b">
          <TabsTrigger value="post">Post</TabsTrigger>
          <TabsTrigger value="event">Event</TabsTrigger>
          <TabsTrigger value="group">Group</TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[calc(100vh-230px)] px-4 sm:px-0">
          {" "}
          {/* Adjust height as needed */}
          <TabsContent value="post" className="space-y-4 mt-0">
            <div className="space-y-1">
              <Label className="block text-sm font-medium">Type</Label>
              <div className="flex gap-4 pt-1">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="offerType"
                    value="offer"
                    checked={offerType === "offer"}
                    onChange={() => setOfferType("offer")}
                    className="mr-2 h-4 w-4"
                  />
                  Offer
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="offerType"
                    value="request"
                    checked={offerType === "request"}
                    onChange={() => setOfferType("request")}
                    className="mr-2 h-4 w-4"
                  />
                  Request
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="post-title">Title</Label>
              <Input
                id="post-title"
                placeholder="Enter a title"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="post-details">Details</Label>
              <Textarea
                id="post-details"
                placeholder="Describe your offer or request..."
                className="min-h-[150px]"
                value={postDetails}
                onChange={(e) => setPostDetails(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="post-location">Location</Label>
              <Input
                id="post-location"
                placeholder="Enter location (e.g., neighborhood, city)"
                value={postLocation}
                onChange={(e) => setPostLocation(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="post-imageUrl">Image URL (Optional)</Label>
              <Input
                id="post-imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.png"
              />
            </div>
            {/* <Button variant="outline" className="w-full">
              <ImageIcon className="h-4 w-4 mr-2" /> Add Photo
            </Button> */}
          </TabsContent>
          <TabsContent value="event" className="space-y-4 mt-0">
            <div className="space-y-1">
              <Label htmlFor="event-title">Title</Label>
              <Input
                id="event-title"
                placeholder="Enter event title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="event-start-date">Start Date & Time</Label>
                <div className="flex gap-2">
                  <Input
                    id="event-start-date"
                    type="date"
                    value={eventStartDate}
                    onChange={(e) => setEventStartDate(e.target.value)}
                  />
                  <Input type="time" value={eventStartTime} onChange={(e) => setEventStartTime(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="event-end-date">End Date & Time</Label>
                <div className="flex gap-2">
                  <Input
                    id="event-end-date"
                    type="date"
                    value={eventEndDate}
                    onChange={(e) => setEventEndDate(e.target.value)}
                  />
                  <Input type="time" value={eventEndTime} onChange={(e) => setEventEndTime(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="event-location">Location (e.g. City, State or Online)</Label>
              <Input
                id="event-location"
                placeholder="Enter location"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="event-venue">Venue Name (Optional)</Label>
              <Input
                id="event-venue"
                placeholder="e.g., Community Hall / Zoom Link"
                value={eventVenueName}
                onChange={(e) => setEventVenueName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="event-details">Details</Label>
              <Textarea
                id="event-details"
                placeholder="Describe your event..."
                className="min-h-[120px]"
                value={eventDetails}
                onChange={(e) => setEventDetails(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="event-imageUrl">Image URL (Optional)</Label>
              <Input
                id="event-imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/event-image.png"
              />
            </div>
            {/* <Button variant="outline" className="w-full"><ImageIcon className="h-4 w-4 mr-2" /> Add Image</Button> */}
            {/* <div className="border-t pt-4"><Button variant="outline" className="w-full"><Plus className="h-4 w-4 mr-2" /> Add Tickets</Button></div> */}
          </TabsContent>
          <TabsContent value="group" className="space-y-3 mt-0">
            {" "}
            {/* Reduced spacing */}
            <div className="space-y-1">
              <Label htmlFor="group-name">
                Group Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="group-name"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="group-summary">Summary</Label>
              <Textarea
                id="group-summary"
                placeholder="A brief summary (1-2 sentences)"
                className="h-20"
                value={groupSummary}
                onChange={(e) => setGroupSummary(e.target.value)}
              />
            </div>
            <EntityMultiSelect
              label="Chapter Associations"
              items={chapterSelectableItems}
              selectedIds={selectedChapterIds}
              onSelectionChange={setSelectedChapterIds}
              searchPlaceholder="Search chapters..."
              listHeight="h-[120px]"
            />
            <EntityMultiSelect
              label="Administrators"
              items={userSelectableItems}
              selectedIds={selectedAdminUserIds}
              onSelectionChange={setSelectedAdminUserIds}
              searchPlaceholder="Search users to add as admins..."
              listHeight="h-[120px]"
            />
            <EntityMultiSelect
              label="Initial Members"
              items={userSelectableItems}
              selectedIds={selectedMemberUserIds}
              onSelectionChange={setSelectedMemberUserIds}
              searchPlaceholder="Search users to add as members..."
              listHeight="h-[120px]"
            />
            <div className="space-y-1">
              <Label htmlFor="group-location">Location (e.g., City or Online)</Label>
              <Input
                id="group-location"
                placeholder="e.g., San Francisco / Online"
                value={groupLocationCity}
                onChange={(e) => setGroupLocationCity(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="group-venue">Venue (if applicable)</Label>
              <Input
                id="group-venue"
                placeholder="e.g., Community Hall Room A / Zoom Link"
                value={groupVenue}
                onChange={(e) => setGroupVenue(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="group-details">Details</Label>
              <Textarea
                id="group-details"
                placeholder="More detailed information about the group"
                className="h-24"
                value={groupDetails}
                onChange={(e) => setGroupDetails(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="group-imageUrl">Image URL (Optional)</Label>
              <Input
                id="group-imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/group-image.png"
              />
            </div>
            {/* <Button variant="outline" className="w-full"><ImageIcon className="h-4 w-4 mr-2" /> Add Image</Button> */}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
