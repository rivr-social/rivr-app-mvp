"use client"

import { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Search, ArrowLeft } from "lucide-react"
import { users } from "@/lib/mock-data"
import { useRouter, useSearchParams } from "next/navigation"
import { formatDistanceToNow } from "date-fns"

// Mock conversation data
const conversations = [
  {
    id: "c1",
    participants: ["user1", "user2"],
    lastMessage: {
      sender: "user2",
      text: "Looking forward to the community garden workday!",
      timestamp: "2025-05-10T14:30:00",
      read: false,
    },
  },
  {
    id: "c2",
    participants: ["user1", "user3"],
    lastMessage: {
      sender: "user1",
      text: "Can you bring the projector to the tech workshop?",
      timestamp: "2025-05-09T10:15:00",
      read: true,
    },
  },
  {
    id: "c3",
    participants: ["user1", "user4"],
    lastMessage: {
      sender: "user4",
      text: "I'll help with setting up the art festival displays",
      timestamp: "2025-05-08T16:45:00",
      read: true,
    },
  },
  {
    id: "c4",
    participants: ["user1", "u5"],
    lastMessage: {
      sender: "u5",
      text: "The food for the community dinner is all prepared!",
      timestamp: "2025-05-07T19:20:00",
      read: true,
    },
  },
]

// Mock messages for conversations
const mockMessages = [
  // Conversation 1 - with John Smith (user2)
  {
    id: "m1",
    conversationId: "c1",
    sender: "user1",
    text: "Hi John! Are you coming to the community garden workday this weekend?",
    timestamp: "2025-05-09T10:30:00",
  },
  {
    id: "m2",
    conversationId: "c1",
    sender: "user2",
    text: "Hey Cameron! Yes, I'll be there. What time does it start again?",
    timestamp: "2025-05-09T10:45:00",
  },
  {
    id: "m3",
    conversationId: "c1",
    sender: "user1",
    text: "It starts at 10 AM. Don't forget to bring your gardening gloves!",
    timestamp: "2025-05-09T11:00:00",
  },
  {
    id: "m4",
    conversationId: "c1",
    sender: "user2",
    text: "Got it! Should I bring any tools?",
    timestamp: "2025-05-09T11:15:00",
  },
  {
    id: "m5",
    conversationId: "c1",
    sender: "user1",
    text: "We have most tools, but if you have pruning shears, those would be helpful.",
    timestamp: "2025-05-09T11:30:00",
  },
  {
    id: "m6",
    conversationId: "c1",
    sender: "user2",
    text: "Perfect, I'll bring mine. Looking forward to the community garden workday!",
    timestamp: "2025-05-10T14:30:00",
  },

  // Conversation 2 - with Jane Doe (user3)
  {
    id: "m7",
    conversationId: "c2",
    sender: "user3",
    text: "Hey Cameron, do you need any help with the tech workshop preparations?",
    timestamp: "2025-05-08T09:15:00",
  },
  {
    id: "m8",
    conversationId: "c2",
    sender: "user1",
    text: "Yes, that would be great! Could you help with setting up the projector?",
    timestamp: "2025-05-08T09:30:00",
  },
  {
    id: "m9",
    conversationId: "c2",
    sender: "user3",
    text: "Sure thing. What time should I arrive?",
    timestamp: "2025-05-08T09:45:00",
  },
  {
    id: "m10",
    conversationId: "c2",
    sender: "user1",
    text: "Can you be there by 5:30 PM? The workshop starts at 6.",
    timestamp: "2025-05-08T10:00:00",
  },
  {
    id: "m11",
    conversationId: "c2",
    sender: "user3",
    text: "No problem, I'll be there at 5:30.",
    timestamp: "2025-05-08T10:15:00",
  },
  {
    id: "m12",
    conversationId: "c2",
    sender: "user1",
    text: "Can you bring the projector to the tech workshop?",
    timestamp: "2025-05-09T10:15:00",
  },

  // Conversation 3 - with Alex Johnson (user4)
  {
    id: "m13",
    conversationId: "c3",
    sender: "user1",
    text: "Hi Alex, we're planning the art festival for next month. Would you be interested in helping?",
    timestamp: "2025-05-07T14:00:00",
  },
  {
    id: "m14",
    conversationId: "c3",
    sender: "user4",
    text: "Hey Cameron! Absolutely, I'd love to help. What do you need?",
    timestamp: "2025-05-07T14:30:00",
  },
  {
    id: "m15",
    conversationId: "c3",
    sender: "user1",
    text: "Great! We need help with designing posters and setting up displays.",
    timestamp: "2025-05-07T15:00:00",
  },
  {
    id: "m16",
    conversationId: "c3",
    sender: "user4",
    text: "I can definitely help with both. When do you need the poster designs by?",
    timestamp: "2025-05-07T15:30:00",
  },
  {
    id: "m17",
    conversationId: "c3",
    sender: "user1",
    text: "By the end of next week would be perfect. And the festival is on September 5th.",
    timestamp: "2025-05-07T16:00:00",
  },
  {
    id: "m18",
    conversationId: "c3",
    sender: "user4",
    text: "I'll help with setting up the art festival displays",
    timestamp: "2025-05-08T16:45:00",
  },

  // Conversation 4 - with Emily Chen (u5)
  {
    id: "m19",
    conversationId: "c4",
    sender: "user1",
    text: "Emily, how are the preparations for the community dinner coming along?",
    timestamp: "2025-05-06T10:00:00",
  },
  {
    id: "m20",
    conversationId: "c4",
    sender: "u5",
    text: "Hi Cameron! Everything is on track. We've confirmed 50 attendees so far.",
    timestamp: "2025-05-06T10:30:00",
  },
  {
    id: "m21",
    conversationId: "c4",
    sender: "user1",
    text: "That's great! Do we have enough volunteers for serving?",
    timestamp: "2025-05-06T11:00:00",
  },
  {
    id: "m22",
    conversationId: "c4",
    sender: "u5",
    text: "We have 8 volunteers signed up. I think we need at least 2 more.",
    timestamp: "2025-05-06T11:30:00",
  },
  {
    id: "m23",
    conversationId: "c4",
    sender: "user1",
    text: "I'll reach out to some people who might be interested. How's the food preparation going?",
    timestamp: "2025-05-06T12:00:00",
  },
  {
    id: "m24",
    conversationId: "c4",
    sender: "u5",
    text: "The food for the community dinner is all prepared!",
    timestamp: "2025-05-07T19:20:00",
  },
]

export default function MessagesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userIdParam = searchParams.get("user")
  const messagesEndRef = useRef(null)

  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [messages, setMessages] = useState(mockMessages)
  const [showConversationList, setShowConversationList] = useState(true)

  // Get the current user (in a real app, this would come from authentication)
  const currentUser = users[0]

  // Set active conversation if user parameter is provided or default to first conversation
  useEffect(() => {
    if (userIdParam) {
      // Find conversation with this user or create a new one
      const existingConversation = conversations.find(
        (conv) => conv.participants.includes(userIdParam) && conv.participants.includes(currentUser.id),
      )

      if (existingConversation) {
        setActiveConversation(existingConversation.id)
        setShowConversationList(false)
      } else {
        // In a real app, you would create a new conversation here
        console.log(`Would create new conversation with user ${userIdParam}`)

        // For demo purposes, just open the first conversation
        if (conversations.length > 0) {
          setActiveConversation(conversations[0].id)
          setShowConversationList(false)
        }
      }
    } else if (conversations.length > 0 && !activeConversation) {
      // If no conversation is active, select the first one by default
      setActiveConversation(conversations[0].id)
    }
  }, [userIdParam, currentUser.id, activeConversation])

  // Scroll to bottom of messages when conversation changes or new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeConversation, messages])

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conversation) => {
    const otherParticipantId = conversation.participants.find((id) => id !== currentUser.id)
    const otherParticipant = users.find((user) => user.id === otherParticipantId)

    return otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  // Get messages for the active conversation
  const conversationMessages = activeConversation
    ? messages.filter((message) => message.conversationId === activeConversation)
    : []

  // Get the other participant in the active conversation
  const getOtherParticipant = (conversation) => {
    const otherParticipantId = conversation.participants.find((id) => id !== currentUser.id)
    return users.find((user) => user.id === otherParticipantId)
  }

  const handleSendMessage = () => {
    if (messageText.trim() && activeConversation) {
      // Create a new message
      const newMessage = {
        id: `m${messages.length + 1}`,
        conversationId: activeConversation,
        sender: currentUser.id,
        text: messageText,
        timestamp: new Date().toISOString(),
      }

      // Add the new message to the messages array
      setMessages([...messages, newMessage])

      // Clear the input
      setMessageText("")
    }
  }

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatConversationTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    } catch (error) {
      return "recently"
    }
  }

  const handleBackToList = () => {
    setShowConversationList(true)
  }

  const handleConversationSelect = (conversationId) => {
    setActiveConversation(conversationId)
    setShowConversationList(false)
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Mobile view - either conversation list or active conversation */}
      <div className="md:hidden flex flex-col h-full">
        {showConversationList ? (
          // Conversation list view
          <div className="flex flex-col h-full">
            <div className="p-4 border-b sticky top-0 bg-background z-10">
              <h1 className="text-2xl font-bold">Messages</h1>
            </div>

            <div className="p-4 sticky top-16 bg-background z-10">
              <div className="relative mb-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search messages..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => {
                const otherParticipant = getOtherParticipant(conversation)
                const isUnread = !conversation.lastMessage.read && conversation.lastMessage.sender !== currentUser.id

                return (
                  <div
                    key={conversation.id}
                    className={`flex items-center gap-3 p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                      isUnread ? "font-medium" : ""
                    }`}
                    onClick={() => handleConversationSelect(conversation.id)}
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={otherParticipant?.avatar || "/placeholder.svg"} alt={otherParticipant?.name} />
                      <AvatarFallback>{otherParticipant?.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <p className="truncate font-medium">{otherParticipant?.name}</p>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                          {formatConversationTime(conversation.lastMessage.timestamp)}
                        </span>
                      </div>
                      <p
                        className={`text-sm truncate ${
                          isUnread ? "text-foreground" : "text-muted-foreground"
                        } flex items-center`}
                      >
                        {conversation.lastMessage.sender === currentUser.id ? "You: " : ""}
                        {conversation.lastMessage.text}
                        {isUnread && <span className="ml-2 w-2 h-2 bg-primary rounded-full inline-block"></span>}
                      </p>
                    </div>
                  </div>
                )
              })}

              {filteredConversations.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No conversations found</p>
              )}
            </div>
          </div>
        ) : (
          // Active conversation view
          <div className="flex flex-col h-full">
            {activeConversation && (
              <>
                <div className="p-3 border-b sticky top-0 bg-background z-10 flex items-center">
                  <Button variant="ghost" size="icon" className="mr-2" onClick={handleBackToList}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>

                  {(() => {
                    const conversation = conversations.find((c) => c.id === activeConversation)
                    const otherParticipant = getOtherParticipant(conversation)

                    return (
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={otherParticipant?.avatar || "/placeholder.svg"}
                            alt={otherParticipant?.name}
                          />
                          <AvatarFallback>{otherParticipant?.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{otherParticipant?.name}</p>
                          <p className="text-xs text-muted-foreground">Online</p>
                        </div>
                      </div>
                    )
                  })()}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {conversationMessages.map((message) => {
                    const isCurrentUser = message.sender === currentUser.id
                    const sender = users.find((user) => user.id === message.sender)

                    return (
                      <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                        <div className="flex gap-2 max-w-[80%]">
                          {!isCurrentUser && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={sender?.avatar || "/placeholder.svg"} alt={sender?.name} />
                              <AvatarFallback>{sender?.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                          )}

                          <div>
                            <div
                              className={`rounded-2xl px-4 py-2 ${
                                isCurrentUser
                                  ? "bg-primary text-primary-foreground rounded-br-none"
                                  : "bg-muted rounded-bl-none"
                              }`}
                            >
                              <p>{message.text}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 px-1">
                              {formatMessageTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-3 border-t sticky bottom-0 bg-background">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      className="rounded-full"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                      size="icon"
                      className="rounded-full"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Desktop view - side by side */}
      <div className="hidden md:flex h-full">
        {/* Conversations list */}
        <div className="w-1/3 border-r flex flex-col">
          <div className="p-4 border-b">
            <h1 className="text-2xl font-bold">Messages</h1>
          </div>

          <div className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search messages..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation)
              const isUnread = !conversation.lastMessage.read && conversation.lastMessage.sender !== currentUser.id

              return (
                <div
                  key={conversation.id}
                  className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted transition-colors ${
                    activeConversation === conversation.id ? "bg-muted" : ""
                  } ${isUnread ? "font-medium" : ""}`}
                  onClick={() => setActiveConversation(conversation.id)}
                >
                  <Avatar>
                    <AvatarImage src={otherParticipant?.avatar || "/placeholder.svg"} alt={otherParticipant?.name} />
                    <AvatarFallback>{otherParticipant?.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="truncate">{otherParticipant?.name}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatConversationTime(conversation.lastMessage.timestamp)}
                      </span>
                    </div>
                    <p className={`text-sm truncate ${isUnread ? "text-foreground" : "text-muted-foreground"}`}>
                      {conversation.lastMessage.sender === currentUser.id ? "You: " : ""}
                      {conversation.lastMessage.text}
                    </p>
                  </div>
                  {isUnread && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                </div>
              )
            })}

            {filteredConversations.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No conversations found</p>
            )}
          </div>
        </div>

        {/* Conversation view */}
        <div className="w-2/3 flex flex-col">
          {activeConversation ? (
            <>
              <div className="p-4 border-b flex items-center gap-3">
                {(() => {
                  const conversation = conversations.find((c) => c.id === activeConversation)
                  const otherParticipant = getOtherParticipant(conversation)

                  return (
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={otherParticipant?.avatar || "/placeholder.svg"}
                          alt={otherParticipant?.name}
                        />
                        <AvatarFallback>{otherParticipant?.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{otherParticipant?.name}</p>
                        <p className="text-xs text-muted-foreground">Online</p>
                      </div>
                    </div>
                  )
                })()}
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversationMessages.map((message) => {
                  const isCurrentUser = message.sender === currentUser.id
                  const sender = users.find((user) => user.id === message.sender)

                  return (
                    <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                      <div className="flex gap-2 max-w-[80%]">
                        {!isCurrentUser && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={sender?.avatar || "/placeholder.svg"} alt={sender?.name} />
                            <AvatarFallback>{sender?.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                        )}

                        <div>
                          <div
                            className={`rounded-2xl px-4 py-2 ${
                              isCurrentUser
                                ? "bg-primary text-primary-foreground rounded-br-none"
                                : "bg-muted rounded-bl-none"
                            }`}
                          >
                            <p>{message.text}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 px-1">
                            {formatMessageTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    className="rounded-full"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    size="icon"
                    className="rounded-full"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Send className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold mb-2">Your Messages</h2>
              <p className="text-muted-foreground mb-4">Send private messages to friends and collaborators</p>
              <Button onClick={() => router.push("/people")}>Start a conversation</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
