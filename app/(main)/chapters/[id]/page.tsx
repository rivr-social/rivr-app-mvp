"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChapterHeader } from "@/components/chapter/chapter-header"
import { ChapterDescription } from "@/components/chapter/chapter-description"
import { PeopleModule } from "@/components/people/people-module"
import { ChapterProjects } from "@/components/chapter/chapter-projects"
import { ChapterResources } from "@/components/chapter/chapter-resources"
import { ChapterEvents } from "@/components/chapter/chapter-events"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

async function getChapter(id: string) {
  try {
    // Using a mock approach instead of environment variable
    const mockChapter = {
      id,
      name: "Chapter " + id,
      description:
        "This is a sample chapter description. In a production environment, this would be fetched from an API.",
      imageUrl: "/placeholder.svg?height=200&width=200&query=chapter",
      members: [],
    }

    return mockChapter
  } catch (error: any) {
    console.log("Failed to fetch chapter: ", error)
  }
}

async function getChapterMembers(id: string) {
  try {
    // Using mock data instead of API call
    const mockMembers = [
      {
        id: "user1",
        name: "Jane Doe",
        email: "jane@example.com",
        avatar: "/placeholder.svg?height=50&width=50&query=person1",
        chapter_admin: true,
      },
      {
        id: "user2",
        name: "John Smith",
        email: "john@example.com",
        avatar: "/placeholder.svg?height=50&width=50&query=person2",
        chapter_admin: false,
      },
    ]

    return mockMembers
  } catch (error: any) {
    console.log("Failed to fetch chapter members: ", error)
  }
}

export default function ChapterPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { data: session } = useSession()
  const [chapter, setChapter] = useState<any>(null)
  const [chapterMembers, setChapterMembers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMember, setIsMember] = useState(false)
  const [isChapterAdmin, setIsChapterAdmin] = useState(false)
  const [open, setOpen] = useState(false)

  const chapterId = Array.isArray(params.id) ? params.id[0] : params.id

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const chapterData = await getChapter(chapterId)
        const chapterMembersData = await getChapterMembers(chapterId)

        if (chapterData) {
          setChapter(chapterData)
        }
        if (chapterMembersData) {
          setChapterMembers(chapterMembersData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [chapterId])

  useEffect(() => {
    if (session?.user && chapterMembers) {
      const member = chapterMembers.find((member) => member.email === session?.user?.email)
      setIsMember(!!member)
      setIsChapterAdmin(member?.chapter_admin === true)
    } else {
      setIsMember(false)
      setIsChapterAdmin(false)
    }
  }, [session?.user, chapterMembers])

  const handleJoinChapter = async () => {
    try {
      // Simulate successful join without API call
      toast({
        title: "Success!",
        description: "You have successfully joined the chapter.",
      })

      // Add current user to members list
      const newMember = {
        id: "current-user",
        name: session?.user?.name || "Current User",
        email: session?.user?.email || "user@example.com",
        avatar: session?.user?.image || "/placeholder.svg?height=50&width=50&query=currentuser",
        chapter_admin: false,
      }

      setChapterMembers([...chapterMembers, newMember])
      setIsMember(true)
    } catch (error: any) {
      console.error("Failed to join chapter: ", error)
      toast({
        title: "Error!",
        description: "Failed to join the chapter.",
        variant: "destructive",
      })
    }
  }

  const handleLeaveChapter = async () => {
    try {
      // Simulate successful leave without API call
      toast({
        title: "Success!",
        description: "You have successfully left the chapter.",
      })

      // Remove current user from members list
      const updatedMembers = chapterMembers.filter((member) => member.email !== session?.user?.email)

      setChapterMembers(updatedMembers)
      setIsMember(false)
    } catch (error: any) {
      console.error("Failed to leave chapter: ", error)
      toast({
        title: "Error!",
        description: "Failed to leave the chapter.",
        variant: "destructive",
      })
    }
  }

  const handleConnectPerson = (person: any) => {
    // Placeholder for connect person logic
    toast({
      title: "Connect Request Sent!",
      description: `Connect request sent to ${person.firstName} ${person.lastName}.`,
    })
  }

  if (isLoading) {
    return (
      <div className="container py-10">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-4 w-[300px] mt-2" />
        <Skeleton className="h-4 w-[200px] mt-2" />
        <div className="mt-6">
          <Skeleton className="h-8 w-[100px]" />
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!chapter) {
    return (
      <div className="container py-10">
        <p>Chapter not found</p>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <ChapterHeader
        name={chapter.name}
        imageUrl={chapter.imageUrl}
        chapterId={chapterId}
        isChapterAdmin={isChapterAdmin}
      />
      <ChapterDescription description={chapter.description} />
      {session?.user ? (
        isMember ? (
          <Button variant="destructive" onClick={handleLeaveChapter}>
            Leave Chapter
          </Button>
        ) : (
          <Button onClick={handleJoinChapter}>Join Chapter</Button>
        )
      ) : (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button>Join Chapter</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Join Chapter</AlertDialogTitle>
              <AlertDialogDescription>You must be logged in to join this chapter.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => router.push("/login")}>Login</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <Tabs defaultValue="projects" className="mt-4">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          {/* Only show the People tab if there are chapter members */}
          {chapterMembers.length > 0 && <TabsTrigger value="people">People</TabsTrigger>}
        </TabsList>
        <TabsContent value="projects">
          <ChapterProjects chapterId={chapterId} isChapterAdmin={isChapterAdmin} />
        </TabsContent>
        <TabsContent value="events">
          <ChapterEvents chapterId={chapterId} isChapterAdmin={isChapterAdmin} />
        </TabsContent>
        <TabsContent value="resources">
          <ChapterResources chapterId={chapterId} isChapterAdmin={isChapterAdmin} />
        </TabsContent>

        {/* If there's a People tab */}
        <TabsContent value="people">
          <PeopleModule
            people={chapterMembers}
            initialViewMode="grid"
            showTabs={false}
            showFilters={false} // Remove filters
            onConnect={handleConnectPerson}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
