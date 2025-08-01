"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostFeed } from "@/components/post-feed"
import { EventFeed } from "@/components/event-feed"
import { GroupFeed } from "@/components/group-feed"
import { PeopleFeed } from "@/components/people-feed"
import { posts, projects, groups, users } from "@/lib/mock-data"
import { Search } from "lucide-react"
import { TrendingTopics } from "./trending"
import { SuggestedFollows } from "./suggested-follows"
import { useAppContext } from "@/contexts/app-context"

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [likedPosts, setLikedPosts] = useState<string[]>([])
  const [rsvpStatuses, setRsvpStatuses] = useState<Record<string, "going" | "maybe" | "none">>({})
  const { state } = useAppContext()
  const selectedChapter = state.selectedChapter

  // Get search query from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const queryParam = params.get("q")

    if (queryParam) {
      setSearchQuery(queryParam)
    }
  }, [])

  // Filter items based on search query and selected chapter
  const filteredPosts = posts.filter((post) => {
    // Filter by chapter if not "all"
    if (selectedChapter !== "all" && !post.chapterTags.includes(selectedChapter)) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      return post.content.toLowerCase().includes(searchQuery.toLowerCase())
    }

    return true
  })

  const filteredEvents = projects
    .filter((p) => p.type === "event")
    .filter((event) => {
      // Filter by chapter if not "all"
      if (selectedChapter !== "all" && !event.chapterTags?.includes(selectedChapter)) {
        return false
      }

      // Filter by search query
      if (searchQuery) {
        return (
          event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      return true
    })

  const filteredGroups = groups.filter((group) => {
    // Filter by chapter if not "all"
    if (selectedChapter !== "all" && !group.chapterTags?.includes(selectedChapter)) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      return (
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return true
  })

  const filteredPeople = users.filter((user) => {
    // Filter by chapter if not "all"
    if (selectedChapter !== "all" && !user.chapterTags?.includes(selectedChapter)) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      return (
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.bio.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return true
  })

  // Helper functions for components
  const getUser = (userId: string) => {
    return (
      users.find((user) => user.id === userId) || {
        id: userId,
        name: "Unknown User",
        username: "unknown",
        avatar: "/placeholder.svg",
        bio: "",
        skills: [],
        points: 0,
        chapterTags: [],
      }
    )
  }

  const getGroup = (groupId: string) => {
    return (
      groups.find((group) => group.id === groupId) || {
        id: groupId,
        name: "Unknown Group",
        description: "",
        members: [],
        avatar: "/placeholder.svg",
        chapterTags: [],
      }
    )
  }

  const getGroupName = (groupId: string) => {
    const group = getGroup(groupId)
    return group.name
  }

  const getGroupId = (groupId: string) => {
    return groupId
  }

  const getEventCreator = (eventId: string) => {
    // In a real app, this would look up the actual creator
    // For now, just return a random user
    return users[Math.floor(Math.random() * users.length)]
  }

  const getCreatorName = (eventId: string) => {
    const creator = getEventCreator(eventId)
    return creator.name
  }

  const getCreatorUsername = (eventId: string) => {
    const creator = getEventCreator(eventId)
    return creator.username
  }

  const getMembers = (memberIds: string[]) => {
    return memberIds.map((id) => getUser(id))
  }

  // Event handlers
  const handleLike = (postId: string) => {
    setLikedPosts((prev) => (prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]))
  }

  const handleComment = (postId: string) => {
    console.log(`Comment on post: ${postId}`)
  }

  const handleShare = (postId: string) => {
    console.log(`Share post: ${postId}`)
  }

  const handleThank = (postId: string) => {
    console.log(`Thank for post: ${postId}`)
  }

  const handleRsvp = (eventId: string, status: "going" | "maybe" | "none") => {
    setRsvpStatuses((prev) => ({
      ...prev,
      [eventId]: status,
    }))
    console.log(`RSVP for event ${eventId}: ${status}`)
  }

  const handleJoinGroup = (groupId: string) => {
    console.log(`Join group: ${groupId}`)
  }

  const handleConnect = (personId: string) => {
    console.log(`Connect with person: ${personId}`)
  }

  // Determine if we should show content in the "all" tab
  const showAllTabContent = searchQuery !== "" || true // Always show content in the "all" tab

  return (
    <div className="container max-w-6xl mx-auto px-4 py-6 pb-20">
      <h1 className="text-2xl font-bold mb-6">Explore</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
            <Input
              type="search"
              placeholder="Search for posts, events, groups, or people..."
              className="pl-10 border-2 border-gray-200 focus-visible:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="data-[state=active]:bg-white data-[state=active]:text-event data-[state=active]:shadow-sm"
              >
                Events
              </TabsTrigger>
              <TabsTrigger
                value="groups"
                className="data-[state=active]:bg-white data-[state=active]:text-group data-[state=active]:shadow-sm"
              >
                Groups
              </TabsTrigger>
              <TabsTrigger
                value="people"
                className="data-[state=active]:bg-white data-[state=active]:text-person data-[state=active]:shadow-sm"
              >
                People
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {showAllTabContent ? (
                <div className="space-y-8">
                  {filteredEvents.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <span className="w-4 h-4 rounded-full bg-event mr-2"></span>
                        Events
                      </h2>
                      <EventFeed
                        events={filteredEvents.slice(0, 2)}
                        getGroupName={getGroupName}
                        getGroupId={getGroupId}
                        getCreatorName={getCreatorName}
                        getCreatorUsername={getCreatorUsername}
                        onRsvpChange={handleRsvp}
                        initialRsvpStatuses={rsvpStatuses}
                        chapterId={selectedChapter}
                      />
                    </div>
                  )}

                  {filteredGroups.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <span className="w-4 h-4 rounded-full bg-group mr-2"></span>
                        Groups
                      </h2>
                      <GroupFeed
                        groups={filteredGroups.slice(0, 2)}
                        getMembers={getMembers}
                        onJoinGroup={handleJoinGroup}
                        chapterId={selectedChapter}
                      />
                    </div>
                  )}

                  {filteredPeople.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <span className="w-4 h-4 rounded-full bg-person mr-2"></span>
                        People
                      </h2>
                      <PeopleFeed people={filteredPeople.slice(0, 2)} onConnect={handleConnect} />
                    </div>
                  )}

                  {filteredPosts.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <span className="w-4 h-4 rounded-full bg-post mr-2"></span>
                        Posts
                      </h2>
                      <PostFeed
                        posts={filteredPosts.slice(0, 3)}
                        getUser={getUser}
                        getGroup={getGroup}
                        getEventCreator={getEventCreator}
                        onLike={handleLike}
                        onComment={handleComment}
                        onShare={handleShare}
                        onThank={handleThank}
                        initialLikedPosts={likedPosts}
                        chapterId={selectedChapter}
                      />
                    </div>
                  )}

                  {filteredEvents.length === 0 &&
                    filteredGroups.length === 0 &&
                    filteredPeople.length === 0 &&
                    filteredPosts.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        {searchQuery
                          ? `No results found for "${searchQuery}"${selectedChapter !== "all" ? " in this chapter" : ""}`
                          : "No content found in this chapter"}
                      </p>
                    )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Enter a search term to find events, groups, people, and posts
                </div>
              )}
            </TabsContent>

            <TabsContent value="events">
              {filteredEvents.length > 0 ? (
                <EventFeed
                  events={filteredEvents}
                  getGroupName={getGroupName}
                  getGroupId={getGroupId}
                  getCreatorName={getCreatorName}
                  getCreatorUsername={getCreatorUsername}
                  onRsvpChange={handleRsvp}
                  initialRsvpStatuses={rsvpStatuses}
                  chapterId={selectedChapter}
                />
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  {searchQuery
                    ? `No events found for "${searchQuery}"${selectedChapter !== "all" ? " in this chapter" : ""}`
                    : selectedChapter !== "all"
                      ? "No events found in this chapter"
                      : "No events found"}
                </p>
              )}
            </TabsContent>

            <TabsContent value="groups">
              {filteredGroups.length > 0 ? (
                <GroupFeed
                  groups={filteredGroups}
                  getMembers={getMembers}
                  onJoinGroup={handleJoinGroup}
                  chapterId={selectedChapter}
                />
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  {searchQuery
                    ? `No groups found for "${searchQuery}"${selectedChapter !== "all" ? " in this chapter" : ""}`
                    : selectedChapter !== "all"
                      ? "No groups found in this chapter"
                      : "No groups found"}
                </p>
              )}
            </TabsContent>

            <TabsContent value="people">
              {filteredPeople.length > 0 ? (
                <PeopleFeed people={filteredPeople} onConnect={handleConnect} />
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  {searchQuery
                    ? `No people found for "${searchQuery}"${selectedChapter !== "all" ? " in this chapter" : ""}`
                    : selectedChapter !== "all"
                      ? "No people found in this chapter"
                      : "No people found"}
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="hidden lg:block">
          <TrendingTopics chapterId={selectedChapter} />
          <SuggestedFollows chapterId={selectedChapter} />
        </div>
      </div>
    </div>
  )
}
