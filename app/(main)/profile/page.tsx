"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Award, Edit2, Check, X, Camera, Plus } from "lucide-react"
import { users, posts, projects, groups, jobShifts, thanks, chapters } from "@/lib/mock-data"
import { EventFeed } from "@/components/event-feed"
import { GroupFeed } from "@/components/group-feed"
import { useToast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts")
  const [likedPosts, setLikedPosts] = useState<string[]>([])
  const [editingBio, setEditingBio] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [editingUsername, setEditingUsername] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const [paymentsEnabled, setPaymentsEnabled] = useState(false)

  // Use the first user as an example
  const user = users[0]

  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    bio: user.bio || "Crafting the global village with pioneering spirit and skills for days!",
    location: "Boulder, Colorado",
    skills: user.skills,
    coverPhoto: "/boulder-landscape.png",
  })

  // Get user's posts
  const userPosts = posts.filter((post) => post.author === user.id)

  // Get user's shifts
  const userShifts = jobShifts.filter((shift) => shift.assignedUsers.includes(user.id))

  // Get events the user is involved in
  const userEvents = projects
    .filter((p) => p.type === "event")
    .filter(
      (event) =>
        userShifts.some((shift) => shift.project === event.id) ||
        event.admins?.includes(user.id) ||
        event.creator === user.id,
    )

  // Determine if user is admin for each event
  const isEventAdmin = (eventId: string) => {
    const event = projects.find((p) => p.id === eventId)
    return event?.admins?.includes(user.id) || event?.creator === user.id
  }

  // Get groups the user is a member of
  const userGroups = groups.filter((group) => group.members.includes(user.id))

  // Get thanks received by the user
  const userThanks = thanks.filter((thank) => thank.to === user.id)
  const totalThanks = userThanks.reduce((sum, thank) => sum + thank.points, 0)

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
        chapterTags: [],
        groupTags: [],
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
        inventory: [],
        avatar: "/placeholder.svg",
        chapterTags: [],
        groupTags: [],
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSkillAdd = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, skill] }))
    }
  }

  const handleSkillRemove = (skill: string) => {
    setFormData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }))
  }

  const handleProfilePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, this would upload the file
    toast({
      title: "Photo uploaded",
      description: "Your profile photo has been updated.",
    })
  }

  const saveBio = () => {
    setEditingBio(false)
    toast({
      title: "Bio updated",
      description: "Your bio has been saved.",
    })
  }

  const saveName = () => {
    setEditingName(false)
    toast({
      title: "Name updated",
      description: "Your name has been saved.",
    })
  }

  const saveUsername = () => {
    // Basic validation for username
    const username = formData.username
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "")
    if (username.length < 3) {
      toast({
        title: "Invalid username",
        description: "Username must be at least 3 characters long.",
        variant: "destructive",
      })
      return
    }

    setFormData((prev) => ({ ...prev, username }))
    setEditingUsername(false)
    toast({
      title: "Username updated",
      description: "Your username has been saved.",
    })
  }

  return (
    <div className="pb-20">
      {/* Cover photo area */}
      <div
        className="h-48 md:h-64 bg-cover bg-center relative group"
        style={{ backgroundImage: `url(${formData.coverPhoto})` }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-4 right-4 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Camera className="h-4 w-4 mr-2" />
          Change Cover
        </Button>
      </div>

      {/* Profile info */}
      <div className="px-4 md:px-8 max-w-6xl mx-auto relative">
        <div className="relative -mt-16 mb-6 flex flex-col md:flex-row md:items-end gap-6">
          <div className="relative group">
            <div
              className="h-32 w-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-md cursor-pointer"
              onClick={handleProfilePhotoClick}
            >
              <img
                src={user.avatar || "/placeholder.svg?height=128&width=128"}
                alt={user.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="mt-4 md:mt-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              {editingName ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="text-2xl font-bold h-auto text-lg md:text-2xl py-1 px-2"
                  />
                  <Button size="sm" onClick={saveName}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingName(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <h1 className="text-2xl font-bold">{formData.name}</h1>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingName(true)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {editingUsername ? (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">@</span>
                  <Input
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="h-auto py-1 px-2 text-sm w-32"
                    placeholder="username"
                    autoFocus
                  />
                  <Button size="sm" onClick={saveUsername}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingUsername(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className="flex items-center gap-2 group cursor-pointer hover:bg-gray-50 rounded px-1 py-0.5 -mx-1"
                  onClick={() => setEditingUsername(true)}
                >
                  <p className="text-muted-foreground">@{formData.username}</p>
                  <Edit2 className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
          <div className="md:col-span-2">
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{formData.location}</span>
              </div>
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{totalThanks} thanks</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              {formData.bio.length > 150 ? `${formData.bio.substring(0, 150)}...` : formData.bio}
              {formData.bio.length > 150 && (
                <button className="text-primary ml-1 hover:underline" onClick={() => setActiveTab("about")}>
                  See more
                </button>
              )}
            </p>
          </div>
        </div>

        {/* Home Chapter Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Home Chapter</label>
          <select className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md">
            <option value="all">All Chapters</option>
            {chapters.map((chapter) => (
              <option key={chapter.id} value={chapter.id}>
                {chapter.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="about" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 md:w-fit">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="events">My Events</TabsTrigger>
            <TabsTrigger value="groups">My Groups</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-6">
            <div className="space-y-6 max-w-2xl">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">About Me</CardTitle>
                  {!editingBio && (
                    <Button size="sm" variant="outline" onClick={() => setEditingBio(true)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {editingBio ? (
                    <div className="space-y-4">
                      <Textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="min-h-[150px]"
                        placeholder="Tell us about yourself..."
                      />
                      <div className="flex gap-2">
                        <Button onClick={saveBio}>
                          <Check className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button variant="outline" onClick={() => setEditingBio(false)}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p>{formData.bio}</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex items-center w-full mb-4">
                      <Input
                        id="new-skill"
                        placeholder="Add skill..."
                        className="h-8 mr-2"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const value = (e.target as HTMLInputElement).value.trim()
                            if (value) {
                              handleSkillAdd(value)
                              ;(e.target as HTMLInputElement).value = ""
                            }
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const input = document.getElementById("new-skill") as HTMLInputElement
                          const value = input.value.trim()
                          if (value) {
                            handleSkillAdd(value)
                            input.value = ""
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, i) => (
                        <Badge key={i} variant="secondary" className="flex items-center group">
                          {skill}
                          <button
                            onClick={() => handleSkillRemove(skill)}
                            className="ml-1 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      {formData.skills.length === 0 && (
                        <p className="text-sm text-muted-foreground">No skills added yet</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            {userEvents.length > 0 ? (
              <EventFeed
                events={userEvents}
                getGroupName={(id) => getGroup(id).name}
                getGroupId={(id) => id}
                getCreatorName={() => user.name}
                getCreatorUsername={() => user.username}
                onRsvpChange={handleRsvp}
                isEventAdmin={isEventAdmin}
              />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">You're not attending any upcoming events</p>
                  <Button>Browse Events</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="groups" className="mt-6">
            {userGroups.length > 0 ? (
              <GroupFeed groups={userGroups} getMembers={getMembers} onJoinGroup={handleJoinGroup} />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">You're not a member of any groups yet</p>
                  <Button>Discover Groups</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="wallet" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Wallet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Thanks Balance</p>
                      <p className="text-sm text-muted-foreground">Thanks received</p>
                    </div>
                    <span className="text-2xl font-bold">{totalThanks}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Sales Balance</p>
                      <p className="text-sm text-muted-foreground">Earnings from sales</p>
                    </div>
                    <span className="text-2xl font-bold">$247.50</span>
                  </div>

                  {/* Payment Configuration */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium">Payment Processing</p>
                        <p className="text-sm text-muted-foreground">
                          {paymentsEnabled ? "Payments are enabled" : "Enable payments to receive money"}
                        </p>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          paymentsEnabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {paymentsEnabled ? "Enabled" : "Disabled"}
                      </div>
                    </div>
                    <Button
                      variant={paymentsEnabled ? "outline" : "default"}
                      onClick={() => {
                        if (paymentsEnabled) {
                          // Open payment settings
                          toast({
                            title: "Payment Settings",
                            description: "Opening payment configuration...",
                          })
                        } else {
                          // Enable payments
                          setPaymentsEnabled(true)
                          toast({
                            title: "Payments Enabled",
                            description: "You can now receive payments for sales.",
                          })
                        }
                      }}
                    >
                      {paymentsEnabled ? "Configure Payments" : "Enable Payments"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
