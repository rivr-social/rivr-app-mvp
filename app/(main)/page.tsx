"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostFeed } from "@/components/post-feed"
import { EventFeed } from "@/components/event-feed"
import { GroupFeed } from "@/components/group-feed"
import { PeopleFeed } from "@/components/people-feed"
import { CreatePost } from "@/components/create-post"
import { posts, projects, groups, users } from "@/lib/mock-data"
import { useAppContext } from "@/contexts/app-context"

export default function Home() {
  const [likedPosts, setLikedPosts] = useState<string[]>([])
  const [rsvpStatuses, setRsvpStatuses] = useState<Record<string, "going" | "maybe" | "none">>({})
  const { state } = useAppContext()
  const selectedChapter = state.selectedChapter

  console.log("Home page - selectedChapter:", selectedChapter) // Debug log

  // Filter content based on selected chapter
  const filteredPosts = posts.filter((post) => {
    if (selectedChapter === "all") return true
    console.log("Filtering post:", post.id, "chapterTags:", post.chapterTags, "selectedChapter:", selectedChapter) // Debug log
    return post.chapterTags && post.chapterTags.includes(selectedChapter)
  })

  const filteredEvents = projects
    .filter((p) => p.type === "event")
    .filter((event) => {
      if (selectedChapter === "all") return true
      return event.chapterTags && event.chapterTags.includes(selectedChapter)
    })

  const filteredGroups = groups.filter((group) => {
    if (selectedChapter === "all") return true
    return group.chapterTags && group.chapterTags.includes(selectedChapter)
  })

  const filteredPeople = users.filter((user) => {
    if (selectedChapter === "all") return true
    return user.chapterTags && user.chapterTags.includes(selectedChapter)
  })

  console.log("Filtered posts count:", filteredPosts.length) // Debug log
  console.log("Total posts count:", posts.length) // Debug log

  // Helper functions
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

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 pb-20">
      <div className="mb-6">
        <CreatePost />
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 mb-6">
          <TabsTrigger
            value="posts"
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
          >
            Posts
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
          >
            Events
          </TabsTrigger>
          <TabsTrigger
            value="groups"
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
          >
            Groups
          </TabsTrigger>
          <TabsTrigger
            value="people"
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
          >
            People
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <PostFeed
            posts={filteredPosts}
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
        </TabsContent>

        <TabsContent value="events">
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
        </TabsContent>

        <TabsContent value="groups">
          <GroupFeed
            groups={filteredGroups}
            getMembers={getMembers}
            onJoinGroup={handleJoinGroup}
            chapterId={selectedChapter}
          />
        </TabsContent>

        <TabsContent value="people">
          <PeopleFeed people={filteredPeople} onConnect={handleConnect} chapterId={selectedChapter} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
