"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostFeed } from "@/components/post-feed"
import { EventFeed } from "@/components/event-feed"
import { GroupFeed } from "@/components/group-feed"
import { PeopleFeed } from "@/components/people-feed"
import { TopBar } from "@/components/top-bar"
import { users } from "@/lib/mock-data"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""
  const [selectedChapter, setSelectedChapter] = useState(searchParams.get("chapter") || "all")
  const [filteredPeople, setFilteredPeople] = useState([])

  // Filter people based on search query and selected chapter
  useEffect(() => {
    if (query) {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.username.toLowerCase().includes(query.toLowerCase()) ||
          (user.bio && user.bio.toLowerCase().includes(query.toLowerCase())),
      )
      setFilteredPeople(filtered)
    } else {
      setFilteredPeople([])
    }
  }, [query])

  // Update URL when chapter changes
  const handleChapterChange = (chapterId: string) => {
    setSelectedChapter(chapterId)

    // Update URL with new chapter
    const params = new URLSearchParams(searchParams.toString())
    params.set("chapter", chapterId)
    router.replace(`/search?${params.toString()}`)
  }

  // Helper function to get members for a group
  const getMembers = (memberIds: string[]) => {
    return memberIds.map((id) => {
      const user = users.find((u) => u.id === id)
      return user || { id, name: "Unknown User", username: "unknown" }
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar selectedChapter={selectedChapter} onChapterChange={handleChapterChange} />

      <div className="container mx-auto px-4 py-6 flex-1 pb-16">
        <h1 className="text-2xl font-bold mb-2">Search Results for "{query}"</h1>
        {selectedChapter !== "all" && (
          <p className="text-muted-foreground mb-4">Filtered by chapter: {selectedChapter}</p>
        )}

        <Tabs defaultValue="posts" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="people">People</TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="mt-4">
            <PostFeed query={query} chapterId={selectedChapter} />
          </TabsContent>
          <TabsContent value="events" className="mt-4">
            <EventFeed query={query} chapterId={selectedChapter} />
          </TabsContent>
          <TabsContent value="groups" className="mt-4">
            <GroupFeed
              query={query}
              chapterId={selectedChapter}
              getMembers={getMembers}
              onJoinGroup={(groupId) => console.log(`Joined group: ${groupId}`)}
            />
          </TabsContent>
          <TabsContent value="people" className="mt-4">
            <PeopleFeed people={filteredPeople} query={query} chapterId={selectedChapter} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
