"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { MessageCircle, MapPin, Calendar, Heart, Plus, Minus, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { posts as mockPosts, users as mockUsers, groups as mockGroups } from "@/lib/mock-data"
import { getChapterName } from "@/lib/utils"

// Helper function to filter posts based on query and chapterId
function filterPosts(posts: any[], query?: string, chapterId?: string) {
  let filtered = [...posts]

  // Filter by chapter if specified
  if (chapterId && chapterId !== "all") {
    filtered = filtered.filter((post) => post.chapterTags.includes(chapterId))
  }

  // Filter by query if specified
  if (query && query.trim() !== "") {
    const normalizedQuery = query.toLowerCase().trim()
    filtered = filtered.filter((post) => post.content.toLowerCase().includes(normalizedQuery))
  }

  return filtered
}

// Helper function to get mock data
function useMockData() {
  return {
    posts: mockPosts,
    users: mockUsers,
    groups: mockGroups,
  }
}

// Default getter functions
const defaultGetUser = (userId: string) => {
  return (
    mockUsers.find((user) => user.id === userId) || {
      id: userId,
      name: "Unknown User",
      username: "unknown",
      avatar: undefined,
      chapterTags: [],
      groupTags: [],
    }
  )
}

const defaultGetGroup = (groupId: string) => {
  return (
    mockGroups.find((group) => group.id === groupId) || {
      id: groupId,
      name: "Unknown Group",
      avatar: undefined,
      chapterTags: [],
      groupTags: [],
    }
  )
}

const defaultGetEventCreator = (eventId: string) => {
  return mockUsers[0] // Default to first user as fallback
}

interface User {
  id: string
  name: string
  username: string
  avatar?: string
  chapterTags: string[]
  groupTags: string[]
}

interface Group {
  id: string
  name: string
  avatar?: string
  chapterTags: string[]
  groupTags: string[]
}

interface Post {
  id: string
  author: string
  content: string
  images?: string[]
  timestamp: string
  likes: number
  comments: number
  type?: string
  chapterTags: string[]
  groupTags: string[]
}

interface Event {
  id: string
  name: string
  description: string
  organizer: string
  timeframe: {
    start: string
    end: string
  }
  image?: string
  chapterTags: string[]
  groupTags: string[]
  startDate?: string
  title?: string
}

interface PostFeedProps {
  posts?: any[]
  events?: any[]
  groups?: any[]
  getUser?: (userId: string) => any
  getGroup?: (groupId: string) => any
  getEventCreator?: (eventId: string) => any
  onComment?: (postId: string) => void
  onThank?: (postId: string) => void
  onRsvp?: (eventId: string, status: "going" | "maybe" | "none") => void
  onJoinGroup?: (groupId: string) => void
  includeAllTypes?: boolean
  initialLikedPosts?: string[]
  query?: string
  chapterId?: string
}

function PostFeedComponent({
  posts: providedPosts,
  events = [],
  groups = [],
  getUser = defaultGetUser,
  getGroup = defaultGetGroup,
  getEventCreator = defaultGetEventCreator,
  onComment,
  onThank,
  onRsvp,
  onJoinGroup,
  includeAllTypes = false,
  initialLikedPosts = [],
  query,
  chapterId,
}: PostFeedProps) {
  const [rsvpStatuses, setRsvpStatuses] = useState<Record<string, "going" | "maybe" | "none">>({})
  const [showThanksModal, setShowThanksModal] = useState<string | null>(null)
  const [thanksCount, setThanksCount] = useState(10)

  // Import mock data
  const { posts: allPosts, users, groups: allGroups } = useMockData()

  // Use provided posts or filter from mock data
  const posts = providedPosts || filterPosts(allPosts, query, chapterId)

  // Sort posts by timestamp, newest first
  const sortedPosts = [...posts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  // If includeAllTypes is true, we'll mix in events and groups
  let feedItems = [...sortedPosts]

  if (includeAllTypes && events.length > 0) {
    // Add events
    const eventItems = events.slice(0, 2).map((event) => ({
      id: `event-${event.id}`,
      type: "event",
      content: event.description,
      images: event.image ? [event.image] : [],
      timestamp: event.startDate || new Date().toISOString(), // Use startDate instead of timeframe.start
      name: event.title || event.name, // Use title as fallback for name
      eventData: event,
      chapterTags: event.chapterTags || [],
      groupTags: event.groupTags || [],
    }))

    feedItems = [...feedItems, ...eventItems]
  }

  if (includeAllTypes && groups.length > 0) {
    // Add groups
    const groupItems = groups.slice(0, 2).map((group) => ({
      id: `group-${group.id}`,
      type: "group",
      content: "Group description",
      timestamp: new Date().toISOString(), // No timestamp for groups, use current
      name: group.name,
      groupData: group,
      chapterTags: group.chapterTags,
      groupTags: group.groupTags,
    }))

    feedItems = [...feedItems, ...groupItems]
  }

  // Sort all items by timestamp
  feedItems = feedItems.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const handleRsvp = (eventId: string, status: "going" | "maybe" | "none") => {
    setRsvpStatuses((prev) => ({
      ...prev,
      [eventId]: status,
    }))

    if (onRsvp) {
      onRsvp(eventId, status)
    }
  }

  const handleThankClick = (postId: string) => {
    setShowThanksModal(postId)
    setThanksCount(10) // Reset to default amount
  }

  const handleGiveThank = (postId: string) => {
    if (onThank) {
      onThank(postId)
    }
    setShowThanksModal(null)
  }

  return (
    <div className="space-y-4 mt-4">
      {feedItems.map((item) => {
        if (item.type === "event") {
          return (
            <EventPostCard
              key={item.id}
              event={item}
              getGroup={getGroup}
              getEventCreator={getEventCreator}
              rsvpStatus={rsvpStatuses[item.id.replace("event-", "")] || "none"}
              onRsvp={(status) => handleRsvp(item.id.replace("event-", ""), status)}
            />
          )
        } else if (item.type === "group") {
          return (
            <GroupPostCard
              key={item.id}
              group={item}
              onJoin={() => onJoinGroup && onJoinGroup(item.id.replace("group-", ""))}
            />
          )
        } else {
          return (
            <PostCard
              key={item.id}
              post={item}
              user={getUser(item.author)}
              onComment={() => onComment && onComment(item.id)}
              onThank={() => handleThankClick(item.id)}
            />
          )
        }
      })}

      {feedItems.length === 0 && <div className="text-center py-8 text-muted-foreground">No posts found</div>}

      {/* Thanks Modal */}
      {showThanksModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowThanksModal(null)}
        >
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-center mb-6">Give some Thanks</h3>

            <div className="flex items-center justify-center gap-4 mb-6">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-12 w-12"
                onClick={() => setThanksCount(Math.max(0, thanksCount - 1))}
                disabled={thanksCount <= 0}
              >
                <Minus className="h-6 w-6" />
              </Button>

              <div className="flex items-center gap-2">
                <Heart className="h-8 w-8 text-red-500" />
                <span className="text-3xl font-bold">{thanksCount}</span>
              </div>

              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-12 w-12"
                onClick={() => setThanksCount(thanksCount + 1)}
              >
                <Plus className="h-6 w-6" />
              </Button>
            </div>

            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center"
              onClick={() => handleGiveThank(showThanksModal)}
              disabled={thanksCount === 0}
            >
              Give
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

interface PostCardProps {
  post: any
  user: any
  onComment: () => void
  onThank: () => void
}

function PostCard({ post, user, onComment, onThank }: PostCardProps) {
  const router = useRouter()
  const formattedDate = new Date(post.timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

  const handleCardClick = () => {
    router.push(`/posts/${post.id}`)
  }

  return (
    <Card
      className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Link href={`/profile/${user?.username}`} onClick={(e) => e.stopPropagation()}>
                <Avatar className="hover:ring-2 hover:ring-primary transition-all">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                  <AvatarFallback>{user?.name?.substring(0, 2) || "UN"}</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <Link
                  href={`/profile/${user?.username}`}
                  className="font-medium hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {user?.name}
                </Link>
                <p className="text-xs text-muted-foreground">{formattedDate}</p>
              </div>
            </div>
            <div className="text-xs bg-gray-100 px-2 py-1 rounded">
              {post.type === "offer" ? "Offer" : post.type === "request" ? "Request" : "Post"}
            </div>
          </div>
          <p className="mb-3">{post.content}</p>

          {/* Display chapter tags */}
          {post.chapterTags && post.chapterTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {post.chapterTags.slice(0, 2).map((chapterId) => (
                <Link key={chapterId} href={`/search?chapter=${chapterId}`} onClick={(e) => e.stopPropagation()}>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                    {getChapterName(chapterId)}
                  </Badge>
                </Link>
              ))}
              {post.chapterTags.length > 2 && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  +{post.chapterTags.length - 2} more
                </Badge>
              )}
            </div>
          )}
        </div>
        {post.images && post.images.length > 0 && (
          <div className="relative w-full h-64">
            <Image src={post.images[0] || "/placeholder.svg"} alt="Post image" fill className="object-cover" />
          </div>
        )}
        {/* Post details section */}
        {(post.title || post.location || post.date) && (
          <div className="p-4 bg-gray-50 border-t space-y-2">
            {post.title && (
              <div className="flex items-start gap-2">
                <span className="font-medium text-sm">What:</span>
                <span className="text-sm">{post.title}</span>
              </div>
            )}
            {post.location && (
              <div className="flex items-start gap-2">
                <span className="font-medium text-sm">Where:</span>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{post.location}</span>
                </div>
              </div>
            )}
            {post.date && (
              <div className="flex items-start gap-2">
                <span className="font-medium text-sm">When:</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{post.date}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-0 border-t">
        <div className="grid grid-cols-2 w-full">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-none h-12 text-muted-foreground"
            onClick={(e) => {
              e.stopPropagation()
              onComment()
            }}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Comment
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-none h-12 text-muted-foreground flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation()
              onThank()
            }}
          >
            <div className="flex items-center gap-1">
              <span className="text-lg">🙏</span>
              <span className="font-medium">{post.thanks || 0}</span>
            </div>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

interface EventPostCardProps {
  event: any
  getGroup: (groupId: string) => any
  getEventCreator: (eventId: string) => any
  rsvpStatus: "going" | "maybe" | "none"
  onRsvp: (status: "going" | "maybe" | "none") => void
}

function EventPostCard({ event, getGroup, getEventCreator, rsvpStatus, onRsvp }: EventPostCardProps) {
  const router = useRouter()
  const eventDate = new Date(event.timestamp || event.eventData?.startDate || new Date())
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
  const formattedTime = eventDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  // Get the group that organized the event
  const organizer = getGroup(event.eventData?.organizer || "unknown")

  // Get the event creator
  const creator = getEventCreator(event.eventData?.id || event.id?.replace("event-", "") || "unknown")

  const handleCardClick = () => {
    // Extract the event ID safely, handling the case where eventData might be undefined
    const eventId = event.eventData?.id || event.id?.replace("event-", "") || "unknown"
    router.push(`/events/${eventId}`)
  }

  return (
    <Card
      className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Link href={`/profile/${creator?.username}`} onClick={(e) => e.stopPropagation()}>
                <Avatar className="hover:ring-2 hover:ring-primary transition-all">
                  <AvatarImage src={creator?.avatar || "/placeholder.svg"} alt={creator?.name} />
                  <AvatarFallback>{creator?.name?.substring(0, 2) || "UN"}</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <div className="font-medium">
                  <Link
                    href={`/groups/${organizer?.id}`}
                    className="text-sm hover:underline block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {organizer?.name || "Unknown Group"}
                  </Link>
                  <Link
                    href={`/profile/${creator?.username}`}
                    className="hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {creator?.name}
                  </Link>
                </div>
                <p className="text-xs text-muted-foreground">{formattedDate}</p>
              </div>
            </div>
            <div className="text-xs bg-gray-100 px-2 py-1 rounded">Event</div>
          </div>
          <p className="mb-3">{event.content}</p>

          {/* Display chapter tags */}
          {event.chapterTags && event.chapterTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {event.chapterTags.slice(0, 2).map((chapterId) => (
                <Link key={chapterId} href={`/search?chapter=${chapterId}`} onClick={(e) => e.stopPropagation()}>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                    {getChapterName(chapterId)}
                  </Badge>
                </Link>
              ))}
              {event.chapterTags.length > 2 && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  +{event.chapterTags.length - 2} more
                </Badge>
              )}
            </div>
          )}
        </div>
        {event.images && event.images.length > 0 && (
          <div className="relative w-full h-64">
            <Image src={event.images[0] || "/placeholder.svg"} alt="Event image" fill className="object-cover" />
          </div>
        )}
        <div className="p-4 bg-gray-50">
          <h3 className="text-lg font-bold mb-1">
            {event.name || event.eventData?.title || event.eventData?.name || "Untitled Event"}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {formattedDate} at {formattedTime}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-0 border-t">
        <div className="grid grid-cols-2 w-full">
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-none h-12 ${rsvpStatus === "maybe" ? "text-primary" : "text-muted-foreground"}`}
            onClick={(e) => {
              e.stopPropagation()
              onRsvp(rsvpStatus === "maybe" ? "none" : "maybe")
            }}
          >
            Maybe
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-none h-12 ${rsvpStatus === "going" ? "text-primary" : "text-muted-foreground"}`}
            onClick={(e) => {
              e.stopPropagation()
              onRsvp(rsvpStatus === "going" ? "none" : "going")
            }}
          >
            Going
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

interface GroupPostCardProps {
  group: any
  onJoin: () => void
}

function GroupPostCard({ group, onJoin }: GroupPostCardProps) {
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/groups/${group.id.replace("group-", "")}`)
  }

  return (
    <Card
      className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={group.groupData?.avatar || "/placeholder.svg"} alt={group.name} />
              <AvatarFallback>{group.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <Link
                href={`/groups/${group.id.replace("group-", "")}`}
                className="text-lg font-bold hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {group.name}
              </Link>
              <p className="text-xs text-muted-foreground">Group</p>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground mb-4">{group.content}</p>

        {/* Display chapter tags */}
        {group.chapterTags && group.chapterTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {group.chapterTags.slice(0, 2).map((chapterId) => (
              <Link key={chapterId} href={`/search?chapter=${chapterId}`} onClick={(e) => e.stopPropagation()}>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                  {getChapterName(chapterId)}
                </Badge>
              </Link>
            ))}
            {group.chapterTags.length > 2 && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                +{group.chapterTags.length - 2} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-0 border-t">
        <Button
          className="w-full rounded-none h-12 bg-primary hover:bg-primary/90"
          onClick={(e) => {
            e.stopPropagation()
            onJoin()
          }}
        >
          Join Group
        </Button>
      </CardFooter>
    </Card>
  )
}

// Export the component with the exact name that's being imported elsewhere
export const PostFeed = PostFeedComponent
