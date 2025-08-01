"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Settings, Users, Calendar, Layers, ExternalLink } from "lucide-react" // Changed LinkIcon to Layers
import { mockGroups, mockUsers, mockEvents, posts as mockPosts, chapters } from "@/lib/mock-data"
import { PostFeed } from "@/components/post-feed"
import { EventFeed } from "@/components/event-feed"
import { PeopleFeed } from "@/components/people-feed"
import { GroupAdminManager } from "@/components/group-admin-manager"
import { GroupRelationships } from "@/components/group-relationships"
import { LoadingSpinner } from "@/components/loading-spinner"
import { EmptyState } from "@/components/empty-state"
import { CreatePost } from "@/components/create-post"
import { CreateEventButton } from "@/components/create-event-button"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function GroupPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("about")
  const [posts, setPosts] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])

  // Mock current user - in a real app, this would come from authentication
  const currentUserId = "user1"
  const currentUser = mockUsers.find((user) => user.id === currentUserId)

  // Get group ID from URL params
  const groupId = params?.id as string

  // Find the group from mock data
  const group = mockGroups.find((g) => g.id === groupId)

  // Get parent group if this is a subgroup
  const parentGroup = group?.parentGroupId ? mockGroups.find((g) => g.id === group.parentGroupId) : null

  // Check if current user is admin or creator
  const isAdmin = group?.adminIds?.includes(currentUserId) || group?.creatorId === currentUserId

  // Get group members
  const groupMembers =
    group?.members?.map((memberId) => mockUsers.find((user) => user.id === memberId)).filter(Boolean) || []

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      // Get group events
      const filteredEvents = mockEvents.filter((event) => event.groupId === groupId)
      setEvents(filteredEvents)

      // Get group posts
      const filteredPosts = mockPosts.filter((post) => post.groupId === groupId || post.groupTags?.includes(groupId))
      setPosts(filteredPosts)

      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [groupId])

  const handlePostCreated = (newPost: any) => {
    setPosts((prevPosts) => [newPost, ...prevPosts])
  }

  const handleEventCreated = (newEvent: any) => {
    setEvents((prevEvents) => [newEvent, ...prevEvents])
  }

  // Helper function to get chapter name
  const getChapterName = (chapterId: string) => {
    const chapter = chapters.find((c) => c.id === chapterId)
    return chapter ? chapter.name : "Unknown Chapter"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (!group) {
    return (
      <div className="p-4">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <EmptyState
          title="Group Not Found"
          description="The group you're looking for doesn't exist or has been removed."
          action={<Button onClick={() => router.push("/groups")}>Browse Groups</Button>}
        />
      </div>
    )
  }

  return (
    <div className="container max-w-5xl mx-auto p-4 pb-20">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* Parent Group Display for Subgroups */}
      {parentGroup && (
        <div className="mb-6 mt-2 p-3 border rounded-md bg-muted/30">
          <div className="flex items-center">
            <Badge variant="outline" className="mr-2">
              Subgroup
            </Badge>
            <span className="text-sm mr-2">Part of:</span>
            <Link href={`/groups/${parentGroup.id}`} className="flex items-center font-medium hover:underline">
              <div className="w-6 h-6 rounded-md mr-2 overflow-hidden">
                <Image
                  src={parentGroup.avatar || "/placeholder.svg"}
                  alt={parentGroup.name}
                  width={24}
                  height={24}
                  className="object-cover"
                />
              </div>
              {parentGroup.name}
              <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>
      )}

      <div className="relative mb-6">
        <div
          className="h-48 rounded-t-lg bg-gradient-to-r w-full"
          style={{
            backgroundColor: group.color || "#4f46e5", // Default indigo-like color
            backgroundImage: group.coverImage ? `url(${group.coverImage})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="absolute bottom-0 left-0 transform translate-y-1/2 ml-6">
          <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
            {group.avatar ? (
              <Image
                src={group.avatar || "/placeholder.svg"}
                alt={group.name}
                width={96}
                height={96}
                className="w-full h-full rounded-xl object-cover"
              />
            ) : (
              <div
                className="w-full h-full rounded-xl flex items-center justify-center text-2xl font-bold text-white"
                style={{ backgroundColor: group.color || "#4f46e5" }}
              >
                {group.name.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {isAdmin && (
          <div className="absolute bottom-0 right-0 mb-2 mr-2">
            <Button size="sm" variant="secondary" onClick={() => router.push(`/groups/${groupId}/edit`)}>
              <Settings className="mr-2 h-4 w-4" />
              Edit Group
            </Button>
          </div>
        )}
      </div>

      <div className="mt-16 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{group.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-muted-foreground">{group.members?.length || 0} members</p>
              {group.isPublic !== false && <Badge variant="outline">Public</Badge>}
              {group.isPublic === false && <Badge variant="outline">Private</Badge>}
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90">Join Group</Button>
        </div>
      </div>

      <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center justify-center">
            <Layers className="mr-2 h-4 w-4" /> {/* Changed Icon */}
            Groups
          </TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <p className="text-base leading-relaxed">{group.description || "No description provided."}</p>

            {group.location && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Location</h3>
                <p className="text-muted-foreground">
                  {group.location.city}
                  {group.location.state && `, ${group.location.state}`}
                  {group.location.country && `, ${group.location.country}`}
                </p>
              </div>
            )}

            {group.chapterTags && group.chapterTags.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Chapters</h3>
                <div className="flex flex-wrap gap-2">
                  {group.chapterTags.map((chapterId) => (
                    <Badge key={chapterId} variant="secondary" className="text-sm">
                      {getChapterName(chapterId)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {group.tags && group.tags.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {group.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Created</h3>
              <p className="text-muted-foreground">
                {new Date(group.createdAt || Date.now()).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="feed" className="space-y-4">
          <CreatePost groupId={groupId} onPostCreated={handlePostCreated} />

          {posts.length > 0 ? (
            <PostFeed
              posts={posts}
              getUser={(userId) => mockUsers.find((u) => u.id === userId) || mockUsers[0]}
              getGroup={(gId) => mockGroups.find((g) => g.id === gId) || mockGroups[0]}
            />
          ) : (
            <EmptyState
              title="No Posts Yet"
              description="Be the first to post in this group!"
              action={<Button onClick={() => document.querySelector("textarea")?.focus()}>Create Post</Button>}
            />
          )}
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          {isAdmin && (
            <div className="mb-6">
              <CreateEventButton groupId={groupId} onEventCreated={handleEventCreated} />
            </div>
          )}

          {events.length > 0 ? (
            <EventFeed
              events={events}
              getGroupName={(id) => {
                const eventGroup = mockGroups.find((g) => g.id === id)
                return eventGroup ? eventGroup.name : "Unknown Group"
              }}
              getGroupId={(id) => id} // This seems to be event ID, not group ID
              getCreatorName={(id) => {
                // Assuming id here is event.id
                const event = events.find((e) => e.id === id)
                const creator = event ? mockUsers.find((u) => u.id === event.creatorId) : null
                return creator ? creator.name : "Unknown User"
              }}
            />
          ) : (
            <EmptyState
              icon={<Calendar className="h-12 w-12 text-muted-foreground" />}
              title="No Events"
              description="This group hasn't scheduled any events yet."
              action={
                isAdmin && (
                  <CreateEventButton
                    groupId={groupId}
                    onEventCreated={handleEventCreated}
                    buttonText="Create First Event"
                  />
                )
              }
            />
          )}
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          {isAdmin && (
            <GroupAdminManager
              groupId={group.id}
              members={group.members || []}
              admins={group.adminIds || []}
              creator={group.creatorId}
              onAdminChange={(newAdmins) => console.log("Admin change:", newAdmins)} // Placeholder
            />
          )}

          {groupMembers.length > 0 ? (
            <PeopleFeed people={groupMembers} showFilters={false} initialViewMode="grid" />
          ) : (
            <EmptyState
              icon={<Users className="h-12 w-12 text-muted-foreground" />}
              title="No Members"
              description="This group doesn't have any members yet."
            />
          )}
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <GroupRelationships group={group} isAdmin={isAdmin} currentUserId={currentUserId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
