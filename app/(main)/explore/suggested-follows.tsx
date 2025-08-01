"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users } from "lucide-react"

interface SuggestedUser {
  id: string
  name: string
  username: string
  avatar?: string
  bio: string
  chapterTags?: string[]
}

// Mock suggested users data
const mockSuggestedUsers: SuggestedUser[] = [
  {
    id: "1",
    name: "Alex Rivera",
    username: "alexrivera",
    avatar: "/augmented-reality-cityscape.png",
    bio: "Climate activist and community organizer",
    chapterTags: ["sf", "oak"],
  },
  {
    id: "2",
    name: "Jordan Chen",
    username: "jordanchen",
    avatar: "/stylized-jc-initials.png",
    bio: "Urban planner focused on affordable housing",
    chapterTags: ["sf", "la"],
  },
  {
    id: "3",
    name: "Taylor Kim",
    username: "taylorkim",
    avatar: "/stylized-initials.png",
    bio: "Food justice advocate and chef",
    chapterTags: ["nyc", "chi"],
  },
  {
    id: "4",
    name: "Morgan Patel",
    username: "morganpatel",
    avatar: "/musical-performance.png",
    bio: "Mutual aid coordinator and healthcare worker",
    chapterTags: ["sf", "oak", "berk"],
  },
  {
    id: "5",
    name: "Casey Johnson",
    username: "caseyjohnson",
    avatar: "/abstract-letter-cj.png",
    bio: "Environmental justice researcher",
    chapterTags: ["sea", "port"],
  },
]

interface SuggestedFollowsProps {
  chapterId?: string
}

export function SuggestedFollows({ chapterId = "all" }: SuggestedFollowsProps) {
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([])
  const [followedUsers, setFollowedUsers] = useState<string[]>([])

  useEffect(() => {
    // Filter users by chapter if specified
    if (chapterId && chapterId !== "all") {
      const filteredUsers = mockSuggestedUsers.filter((user) => user.chapterTags?.includes(chapterId))
      setSuggestedUsers(filteredUsers)
    } else {
      setSuggestedUsers(mockSuggestedUsers)
    }
  }, [chapterId])

  const handleFollow = (userId: string) => {
    setFollowedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Users className="h-5 w-5 mr-2 text-primary" />
          Suggested Follows
        </CardTitle>
      </CardHeader>
      <CardContent>
        {suggestedUsers.length > 0 ? (
          <div className="space-y-4">
            {suggestedUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Link href={`/profile/${user.username}`} className="font-medium hover:underline block">
                      {user.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{user.bio}</p>
                  </div>
                </div>
                <Button
                  variant={followedUsers.includes(user.id) ? "outline" : "default"}
                  size="sm"
                  onClick={() => handleFollow(user.id)}
                >
                  {followedUsers.includes(user.id) ? "Following" : "Follow"}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-2">No suggested follows in this chapter</p>
        )}
      </CardContent>
    </Card>
  )
}
