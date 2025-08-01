"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Award, Calendar, MapPin, Users, MessageSquare } from "lucide-react"
import { PostFeed } from "@/components/post-feed"
import { EventFeed } from "@/components/event-feed"
import { GroupFeed } from "@/components/group-feed"
import { users, posts, projects, groups, jobShifts, thanks, chapters } from "@/lib/mock-data"
import { FollowButton } from "@/components/follow-button"
import { useRouter } from "next/navigation"
import { TagDisplay } from "@/components/tag-display"
import { PeopleModule } from "@/components/people-module"

export default function ProfilePage({ params }: { params: { username: string } }) {
  const [activeTab, setActiveTab] = useState("about")
  const [likedPosts, setLikedPosts] = useState<string[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const router = useRouter()

  // Find user by username
  const user = users.find((u) => u.username === params.username) || users[0]

  // Get user's posts
  const userPosts = posts.filter((post) => post.author === user.id)

  // Get user's shifts
  const userShifts = jobShifts.filter((shift) => shift.assignedUsers.includes(user.id))

  // Get events the user is involved in
  const userEvents = projects
    .filter((p) => p.type === "event")
    .filter((event) => userShifts.some((shift) => shift.project === event.id))

  // Get groups the user is a member of
  const userGroups = groups.filter((group) => group.members.includes(user.id))

  // Get thanks received by the user
  const userThanks = thanks.filter((thank) => thank.to === user.id)
  const totalThanksPoints = userThanks.reduce((sum, thank) => sum + thank.points, 0)

  // Get connections for the people tab
  // For demo purposes, we'll create a mix of followers, following, and connections
  const connections = users
    .filter((u) => u.id !== user.id)
    .slice(0, 20)
    .map((u, index) => {
      // Assign relationship types in a pattern
      let relationshipType
      if (index % 4 === 0) relationshipType = "Following"
      else if (index % 4 === 1) relationshipType = "Followers"
      else if (index % 4 === 2) relationshipType = "Connections"
      else relationshipType = "Collaborators"

      return {
        ...u,
        relationshipType,
      }
    })

  // Helper functions for PostFeed
  const getUser = (userId: string) => {
    return (
      users.find((u) => u.id === userId) || {
        id: userId,
        name: "Unknown User",
        username: "unknown",
        avatar: "/placeholder.svg",
        bio: "",
        skills: [],
        points: 0,
      }
    )
  }

  const getGroup = (groupId: string) => {
    return (
      groups.find((g) => g.id === groupId) || {
        id: groupId,
        name: "Unknown Group",
        description: "",
        members: [],
        avatar: "/placeholder.svg",
      }
    )
  }

  const getEventCreator = (eventId: string) => {
    // In a real app, this would look up the actual creator
    // For now, just return a random user
    return users[Math.floor(Math.random() * users.length)]
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
    console.log(`RSVP for event ${eventId}: ${status}`)
  }

  const handleJoinGroup = (groupId: string) => {
    console.log(`Join group: ${groupId}`)
  }

  const handleConnect = () => {
    setIsConnected(!isConnected)
  }

  const handleConnectPerson = (personId: string) => {
    console.log(`Connect with person: ${personId}`)
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6">
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-muted-foreground">@{user.username}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleConnect}>{isConnected ? "Connected" : "Connect"}</Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/messages?user=${user.id}`)}
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Message
                  </Button>
                  <FollowButton objectId={user.id} objectType="person" />
                </div>
              </div>

              <p className="my-4">{user.bio}</p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">San Francisco, CA</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{user.points} points</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{userEvents.length} upcoming events</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{userGroups.length} groups</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {user.skills.map((skill, i) => (
                  <Badge key={i} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>

              {/* Display chapter tags */}
              <div className="mt-4">
                <p className="text-sm font-medium mb-1">Chapters:</p>
                <TagDisplay tags={user.chapterTags} type="chapter" maxDisplay={5} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="about" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="people">People</TabsTrigger>
          <TabsTrigger value="thanks">Thanks</TabsTrigger>
        </TabsList>

        <TabsContent value="about">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">Bio</h3>
                  <p>{user.bio}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">Chapters</h3>
                  <TagDisplay tags={user.chapterTags} type="chapter" maxDisplay={10} />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-3 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">San Francisco, CA</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Users className="h-4 w-4 mr-3 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Member Since</p>
                        <p className="text-sm text-muted-foreground">January 2023</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Community Building", "Sustainability", "Urban Gardening", "Music", "Technology"].map(
                      (interest, i) => (
                        <Badge key={i} variant="outline">
                          {interest}
                        </Badge>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">Contact</h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => router.push(`/messages?user=${user.id}`)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                    <Button variant="outline" size="sm" className="w-full" onClick={handleConnect}>
                      {isConnected ? "Connected" : "Connect"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="posts">
          {userPosts.length > 0 ? (
            <PostFeed
              posts={userPosts}
              getUser={getUser}
              getGroup={getGroup}
              getEventCreator={getEventCreator}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
              onThank={handleThank}
              initialLikedPosts={likedPosts}
            />
          ) : (
            <p className="text-center text-muted-foreground py-8">No posts yet</p>
          )}
        </TabsContent>

        <TabsContent value="events">
          {userEvents.length > 0 ? (
            <EventFeed
              events={userEvents}
              getGroupName={(id) => getGroup(id).name}
              getGroupId={(id) => id}
              getCreatorName={() => user.name}
              getCreatorUsername={() => user.username}
              onRsvpChange={handleRsvp}
            />
          ) : (
            <p className="text-center text-muted-foreground py-8">No upcoming events</p>
          )}
        </TabsContent>

        <TabsContent value="groups">
          {userGroups.length > 0 ? (
            <GroupFeed groups={userGroups} getMembers={getMembers} onJoinGroup={handleJoinGroup} />
          ) : (
            <p className="text-center text-muted-foreground py-8">Not a member of any groups</p>
          )}
        </TabsContent>

        <TabsContent value="people">
          <div className="mt-4">
            <Card>
              <CardContent className="p-6">
                <PeopleModule
                  people={connections}
                  chapters={chapters}
                  groups={userGroups}
                  initialViewMode="grid"
                  showTabs={true}
                  showFilters={true} // Keep filters on profile page
                  onConnect={handleConnectPerson}
                  title="People"
                  subtitle="People connected to this user"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="thanks">
          <div className="mt-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Thanks Received</h3>
                <p className="text-muted-foreground mb-4">
                  Total points received: <span className="font-medium">{totalThanksPoints}</span>
                </p>

                {userThanks.length > 0 ? (
                  <div className="space-y-4">
                    {userThanks.map((thank) => {
                      const fromUser = users.find((u) => u.id === thank.from)
                      return (
                        <div key={thank.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={fromUser?.avatar || "/placeholder.svg"} alt={fromUser?.name} />
                            <AvatarFallback>{fromUser?.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{fromUser?.name}</span>
                              <Badge variant="outline">{thank.points} points</Badge>
                            </div>
                            <p className="text-sm">{thank.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(thank.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">No thanks received yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
