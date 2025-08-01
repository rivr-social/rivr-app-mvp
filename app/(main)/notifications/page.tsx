"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, Heart, Calendar, Users, MessageSquare, Bell } from "lucide-react"
import { users, groups, projects } from "@/lib/mock-data"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Mock notification data
const notifications = [
  {
    id: "n1",
    type: "like",
    actor: "u2",
    target: "post1",
    read: false,
    timestamp: "2025-05-14T10:30:00",
    isFollowed: true,
  },
  {
    id: "n2",
    type: "comment",
    actor: "u3",
    target: "post1",
    content: "Great initiative! I'd love to help out.",
    read: false,
    timestamp: "2025-05-14T09:45:00",
    isFollowed: true,
  },
  {
    id: "n3",
    type: "event_invite",
    actor: "u4",
    target: "p2",
    read: true,
    timestamp: "2025-05-13T14:20:00",
    isFollowed: false,
  },
  {
    id: "n4",
    type: "group_join",
    actor: "u5",
    target: "g1",
    read: true,
    timestamp: "2025-05-12T16:10:00",
    isFollowed: true,
  },
  {
    id: "n5",
    type: "message",
    actor: "u2",
    content: "Are you coming to the garden workday?",
    read: true,
    timestamp: "2025-05-11T11:05:00",
    isFollowed: false,
  },
  {
    id: "n6",
    type: "like",
    actor: "u5",
    target: "post3",
    read: true,
    timestamp: "2025-05-10T08:30:00",
    isFollowed: true,
  },
  {
    id: "n7",
    type: "event_update",
    actor: "u1",
    target: "p1",
    content: "The event location has been updated",
    read: false,
    timestamp: "2025-05-14T11:30:00",
    isFollowed: true,
  },
  {
    id: "n8",
    type: "group_post",
    actor: "u3",
    target: "g2",
    content: "New post in Tech for Good",
    read: false,
    timestamp: "2025-05-14T08:15:00",
    isFollowed: true,
  },
]

export default function NotificationsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [readNotifications, setReadNotifications] = useState<string[]>(
    notifications.filter((n) => n.read).map((n) => n.id),
  )

  // Mark a notification as read
  const markAsRead = (notificationId: string) => {
    if (!readNotifications.includes(notificationId)) {
      setReadNotifications([...readNotifications, notificationId])
    }
  }

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !readNotifications.includes(notification.id)
    if (activeTab === "following") return notification.isFollowed
    return notification.type === activeTab
  })

  // Get notification details
  const getNotificationDetails = (notification) => {
    const actor = users.find((user) => user.id === notification.actor)

    switch (notification.type) {
      case "like":
        return {
          icon: <Heart className="h-5 w-5 text-red-500" />,
          message: (
            <>
              <span className="font-medium">{actor?.name}</span> liked your post
            </>
          ),
          link: `/posts/${notification.target}`,
        }
      case "comment":
        return {
          icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
          message: (
            <>
              <span className="font-medium">{actor?.name}</span> commented: "{notification.content}"
            </>
          ),
          link: `/posts/${notification.target}`,
        }
      case "event_invite":
        const event = projects.find((p) => p.id === notification.target)
        return {
          icon: <Calendar className="h-5 w-5 text-green-500" />,
          message: (
            <>
              <span className="font-medium">{actor?.name}</span> invited you to {event?.name}
            </>
          ),
          link: `/events/${notification.target}`,
        }
      case "group_join":
        const group = groups.find((g) => g.id === notification.target)
        return {
          icon: <Users className="h-5 w-5 text-purple-500" />,
          message: (
            <>
              <span className="font-medium">{actor?.name}</span> joined {group?.name}
            </>
          ),
          link: `/groups/${notification.target}`,
        }
      case "message":
        return {
          icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
          message: (
            <>
              <span className="font-medium">{actor?.name}</span> sent you a message: "{notification.content}"
            </>
          ),
          link: `/messages`,
        }
      case "event_update":
        const updatedEvent = projects.find((p) => p.id === notification.target)
        return {
          icon: <Calendar className="h-5 w-5 text-green-500" />,
          message: (
            <>
              <span className="font-medium">{updatedEvent?.name}</span>: {notification.content}
            </>
          ),
          link: `/events/${notification.target}`,
        }
      case "group_post":
        const postGroup = groups.find((g) => g.id === notification.target)
        return {
          icon: <Users className="h-5 w-5 text-purple-500" />,
          message: (
            <>
              <span className="font-medium">{notification.content}</span> by {actor?.name}
            </>
          ),
          link: `/groups/${notification.target}`,
        }
      default:
        return {
          icon: <Bell className="h-5 w-5 text-gray-500" />,
          message: <span>New notification</span>,
          link: "#",
        }
    }
  }

  // Format notification time
  const formatNotificationTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) {
      return `${diffMins}m ago`
    } else if (diffHours < 24) {
      return `${diffHours}h ago`
    } else if (diffDays < 7) {
      return `${diffDays}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" className="p-0" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="like">Likes</TabsTrigger>
          <TabsTrigger value="comment">Comments</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => {
              const { icon, message, link } = getNotificationDetails(notification)
              const isRead = readNotifications.includes(notification.id)
              const actor = users.find((user) => user.id === notification.actor)

              return (
                <Link href={link} key={notification.id} onClick={() => markAsRead(notification.id)}>
                  <Card
                    className={`p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors cursor-pointer ${
                      !isRead ? "border-l-4 border-l-primary" : ""
                    } ${notification.isFollowed ? "bg-blue-50/50" : ""}`}
                  >
                    <Avatar>
                      <AvatarImage src={actor?.avatar || "/placeholder.svg"} alt={actor?.name} />
                      <AvatarFallback>{actor?.name?.substring(0, 2)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {icon}
                        <p className={`${!isRead ? "font-medium" : ""}`}>{message}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatNotificationTime(notification.timestamp)}
                      </p>
                    </div>

                    {notification.isFollowed && (
                      <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Following</div>
                    )}
                    {!isRead && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                  </Card>
                </Link>
              )
            })
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold mb-2">No notifications</h2>
              <p className="text-muted-foreground">
                {activeTab === "all"
                  ? "You don't have any notifications yet"
                  : activeTab === "unread"
                    ? "You've read all your notifications"
                    : activeTab === "following"
                      ? "No notifications from followed content"
                      : `You don't have any ${activeTab} notifications`}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {filteredNotifications.length > 0 && (
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => setReadNotifications(notifications.map((n) => n.id))}>
            Mark all as read
          </Button>
        </div>
      )}
    </div>
  )
}
