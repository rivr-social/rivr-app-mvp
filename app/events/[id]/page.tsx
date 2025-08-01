"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Share2, CalendarPlus, Video } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { projects, users, groups, chapters, posts as mockPosts } from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useUser } from "@/contexts/user-context"
import { PostFeed } from "@/components/post-feed"
import { PeopleFeed } from "@/components/people-feed"
import { CommentFeed } from "@/components/comment-feed"
import { CreatePost } from "@/components/create-post"

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [rsvpStatus, setRsvpStatus] = useState<"going" | "interested" | "none">("none")
  const [activeTab, setActiveTab] = useState("about")
  const [eventUpdates, setEventUpdates] = useState<any[]>([])

  const { isCreator, isAdmin } = useUser()

  // Find the event by ID
  const event = projects.find((p) => p.id === params.id) || projects[0]

  // Get the organizing group
  const organizer = groups.find((g) => g.id === event.organizer)

  // Get a random user as the event creator
  const creator = users.find((user) => user.id === event.creator) || users[0]

  // Format dates
  const startDate = new Date(event.timeframe.start)
  const endDate = new Date(event.timeframe.end)

  // Get random users for RSVPs
  const attendees = users.slice(0, Math.floor(Math.random() * 10) + 3)
  const goingCount = Math.floor(Math.random() * 50) + 10
  const interestedCount = Math.floor(Math.random() * 30) + 5

  // Get the chapter
  const eventChapter = chapters.find((c) => event.chapterTags && event.chapterTags.includes(c.id))

  // Initialize event updates
  useEffect(() => {
    // Get event updates (posts related to this event)
    const updates = mockPosts
      .filter((post) => post.eventId === params.id || post.content.includes(event.name))
      .map((post) => ({
        ...post,
        author: post.author || creator.id,
        timestamp: post.timestamp || new Date().toISOString(),
      }))

    setEventUpdates(updates)
  }, [params.id, event.name, creator.id])

  const handleRsvp = (status: "going" | "interested" | "none") => {
    const newStatus = status === rsvpStatus ? "none" : status
    setRsvpStatus(newStatus)

    toast({
      title: newStatus === "none" ? "RSVP removed" : `You're ${newStatus}!`,
      description:
        newStatus === "none"
          ? "You've removed your RSVP for this event."
          : `You've marked yourself as ${newStatus} for this event.`,
    })
  }

  // Handle new post creation
  const handlePostCreated = (newPost: any) => {
    setEventUpdates((prev) => [newPost, ...prev])
  }

  // Determine if tickets are available
  const hasTickets = event.price !== undefined && event.price > 0

  // Check if user can edit the event - temporarily set to true for testing
  const canEditEvent = true // This ensures the edit button is always visible

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-8 px-4">
      {/* Main content container */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
        {/* Left column - Event image and details */}
        <div className="w-full md:w-[350px] flex-shrink-0 flex flex-col gap-4">
          {/* Event image */}
          <div className="relative w-full aspect-square overflow-hidden">
            <Image
              src={event.image || "/placeholder.svg?height=400&width=400&query=colorful event"}
              alt={event.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Presented by */}
          <div className="bg-white p-4">
            <p className="text-sm text-gray-500 mb-2">Presented by</p>
            <Link href={`/groups/${organizer?.id || "#"}`} className="flex items-center gap-3 hover:opacity-80">
              <Avatar className="h-8 w-8">
                <AvatarImage src={organizer?.avatar || "/placeholder.svg"} alt={organizer?.name || "Organizer"} />
                <AvatarFallback>{organizer?.name?.substring(0, 2) || "OR"}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{organizer?.name || "Event Organizer"}</span>
            </Link>
            <p className="text-sm text-gray-600 mt-3">{event.description?.substring(0, 100)}...</p>
          </div>

          {/* Hosted by */}
          <div className="bg-white p-4">
            <p className="text-sm text-gray-500 mb-2">Hosted By</p>
            <Link
              href={`/profile/${creator.username || creator.id}`}
              className="flex items-center gap-3 hover:opacity-80"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={creator.avatar || "/placeholder.svg"} alt={creator.name} />
                <AvatarFallback>{creator.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{creator.name}</span>
            </Link>
          </div>

          {/* Chapter */}
          {eventChapter && (
            <div className="bg-white p-4">
              <p className="text-sm text-gray-500 mb-2">Chapter</p>
              <Link href={`/chapters/${eventChapter.id}`} className="flex items-center gap-3 hover:opacity-80">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={eventChapter.image || "/placeholder.svg"} alt={eventChapter.name} />
                  <AvatarFallback>{eventChapter.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{eventChapter.name}</span>
              </Link>
            </div>
          )}

          {/* Attendees */}
          <div className="bg-white p-4">
            <p className="font-medium mb-2">{goingCount} Going</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {attendees.slice(0, 5).map((attendee) => (
                <Link key={attendee.id} href={`/profile/${attendee.username || attendee.id}`}>
                  <Avatar className="h-8 w-8 hover:opacity-80">
                    <AvatarImage src={attendee.avatar || "/placeholder.svg"} alt={attendee.name} />
                    <AvatarFallback>{attendee.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                </Link>
              ))}
              {goingCount > 5 && (
                <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 text-xs font-medium">
                  +{goingCount - 5}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">
              <Link href={`/profile/rathermercurial`} className="hover:underline">
                rathermercurial.eth
              </Link>
              ,
              <Link href={`/profile/temitope`} className="hover:underline">
                {" "}
                Temitope O. Hassan
              </Link>{" "}
              and {goingCount - 2} others
            </p>
          </div>

          {/* Contact links */}
          <div className="bg-white p-4">
            <button className="text-gray-600 hover:text-gray-900 text-sm block mb-2">Contact the Host</button>
            <button className="text-gray-600 hover:text-gray-900 text-sm block">Report Event</button>
          </div>
        </div>

        {/* Right column - Event details */}
        <div className="flex-1">
          {/* Event title and details */}
          <div className="bg-white p-6 mb-6">
            <h1 className="text-3xl font-bold mb-2">{event.name}</h1>

            <div className="mb-4">
              <div className="text-lg">{format(startDate, "EEEE, MMMM d")}</div>
              <div className="text-lg">
                {format(startDate, "h:mm a")} - {format(endDate, "h:mm a")} {format(startDate, "z")}
              </div>
            </div>

            <div className="flex items-center mb-4">
              <Video className="h-5 w-5 mr-2 text-gray-500" />
              <span>Zoom</span>
            </div>
          </div>

          {/* Registration section */}
          <div className="bg-white p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Registration</h2>

            <div className="mb-4">
              <p className="mb-2">Welcome! To join the event, please register below.</p>

              <div className="flex items-center p-3 bg-gray-50 mb-4">
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarImage src={creator.avatar || "/placeholder.svg"} alt={creator.name} />
                  <AvatarFallback>{creator.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{creator.name}</p>
                  <p className="text-sm text-gray-500">{creator.email || "user@example.com"}</p>
                </div>
              </div>
            </div>

            <Button
              className="w-full py-6 text-lg font-medium bg-black/90 hover:bg-black/80 text-white"
              onClick={() => router.push(`/events/${params.id}/tickets`)}
            >
              Register
            </Button>

            {canEditEvent && (
              <Button
                variant="default"
                className="w-full py-6 text-lg font-medium mt-3 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => router.push(`/events/${params.id}/edit`)}
              >
                Edit Event
              </Button>
            )}

            <div className="flex gap-3 mt-4">
              <Button variant="ghost" className="flex-1" onClick={() => toast({ title: "Event added to calendar" })}>
                <CalendarPlus className="h-4 w-4 mr-2" />
                Add to Calendar
              </Button>
              <Button variant="ghost" className="flex-1" onClick={() => toast({ title: "Event link copied" })}>
                <Share2 className="h-4 w-4 mr-2" />
                Invite a Friend
              </Button>
            </div>

            <div className="text-sm text-gray-500 mt-4 text-center">
              No longer able to attend? <button className="text-primary hover:underline">Notify the host</button> by
              canceling your registration.
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white overflow-hidden">
            <Tabs defaultValue="about" className="w-full" onValueChange={setActiveTab} value={activeTab}>
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger
                  value="about"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  About
                </TabsTrigger>
                <TabsTrigger
                  value="attendees"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Attendees
                </TabsTrigger>
                <TabsTrigger
                  value="discussion"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Discussion
                </TabsTrigger>
                <TabsTrigger
                  value="updates"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Updates
                </TabsTrigger>
              </TabsList>

              <div className="p-6">
                <TabsContent value="about" className="mt-0">
                  <h2 className="text-2xl font-semibold mb-4">About Event</h2>
                  <div className="prose max-w-none">
                    <p className="mb-4">{event.description}</p>
                    <p className="mb-4">
                      {event.name} is a community dedicated to fostering collaboration, awarding public goods creators,
                      and optimizing governance on the Superchain.
                    </p>
                    <p className="mb-4">
                      Our biweekly events feature the Respect Game, an onchain social game where you can meet builders,
                      share your work, and earn respect for helping the community. You can explore our website and watch
                      our previous videos to learn how we can create profound benefits for all.
                    </p>
                    <p>
                      After the event you're also welcome to participate in our Town Hall, a collaborative forum
                      dedicated to conversations about the community where participants choose the topics with respect.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="attendees" className="mt-0">
                  <h2 className="text-xl font-semibold mb-4">{goingCount} Going</h2>
                  {/* Use PeopleFeed component for attendees */}
                  <PeopleFeed people={attendees} />
                </TabsContent>

                <TabsContent value="discussion" className="mt-0">
                  <h2 className="text-xl font-semibold mb-4">Event Discussion</h2>
                  {/* Use CommentFeed component for discussion */}
                  <CommentFeed eventId={params.id} />
                </TabsContent>

                <TabsContent value="updates" className="mt-0">
                  <h2 className="text-xl font-semibold mb-4">Event Updates</h2>
                  {/* Use full creator module without event/group tabs and type selector */}
                  <CreatePost
                    eventId={params.id}
                    onPostCreated={handlePostCreated}
                    showEventTab={false}
                    showGroupTab={false}
                    showTypeSelector={false}
                    fullCreator={true}
                  />
                  {/* Use PostFeed for updates */}
                  <PostFeed posts={eventUpdates} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
