"use client"

import { useState, type KeyboardEvent } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { ImageIcon, X } from "lucide-react"
import Image from "next/image"

interface CreatePostProps {
  eventId?: string
  groupId?: string
  onPostCreated?: (post: any) => void
  placeholder?: string
  showEventTab?: boolean
  showGroupTab?: boolean
  showTypeSelector?: boolean
  fullCreator?: boolean
}

export function CreatePost({
  eventId,
  groupId,
  onPostCreated,
  placeholder,
  showEventTab = true,
  showGroupTab = true,
  showTypeSelector = true,
  fullCreator = false,
}: CreatePostProps) {
  const { toast } = useToast()
  const [content, setContent] = useState("")
  const [isExpanded, setIsExpanded] = useState(fullCreator)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [postType, setPostType] = useState<"post" | "offer" | "request">("post")
  const router = useRouter()

  const handleFocus = () => {
    if (!fullCreator) {
      router.push("/create")
      return
    }
    setIsExpanded(true)
  }

  const handleCancel = () => {
    if (!fullCreator) return
    setIsExpanded(false)
    setContent("")
    setSelectedImages([])
    setPostType("post")
  }

  const handleImageSelect = () => {
    // Simulate file selection - in real app this would open file picker
    const mockImages = [
      "/abstract-colorful-shapes.png",
      "/community-event.png",
      "/vibrant-community-gathering.png",
      "/coding-collaboration.png",
    ]
    const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)]
    setSelectedImages((prev) => [...prev, randomImage])
  }

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (!content.trim() || isSubmitting) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const newPost = {
        id: `post-${Date.now()}`,
        author: "user1", // Current user
        content: content,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: 0,
        images: selectedImages,
        type: showTypeSelector ? postType : "post",
        eventId,
        groupId,
        chapterTags: [],
        groupTags: groupId ? [groupId] : [],
      }

      if (onPostCreated) {
        onPostCreated(newPost)
      }

      setContent("")
      setIsExpanded(fullCreator)
      setSelectedImages([])
      setPostType("post")
      setIsSubmitting(false)

      toast({
        title: "Post created",
        description: "Your post has been published successfully.",
      })
    }, 500)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const defaultPlaceholder = eventId
    ? "Write an update about this event..."
    : groupId
      ? "Share something with the group..."
      : "What's on your mind?"

  if (!fullCreator) {
    return (
      <Card className="border shadow-sm mb-6">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/cameron-profile.png" alt="You" />
              <AvatarFallback>YO</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                onFocus={handleFocus}
                placeholder={placeholder || defaultPlaceholder}
                className="resize-none min-h-[40px] cursor-pointer"
                readOnly
              />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border shadow-sm mb-6">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/cameron-profile.png" alt="You" />
            <AvatarFallback>YO</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder || defaultPlaceholder}
              className="resize-none min-h-[100px] border-none p-0 focus-visible:ring-0 text-lg"
              autoFocus={isExpanded}
            />

            {/* Image previews */}
            {selectedImages.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Upload ${index + 1}`}
                      width={200}
                      height={200}
                      className="rounded-lg object-cover w-full h-32"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Type selector */}
            {showTypeSelector && (
              <div className="flex gap-2 mt-4">
                <Button
                  type="button"
                  variant={postType === "post" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPostType("post")}
                >
                  Post
                </Button>
                <Button
                  type="button"
                  variant={postType === "offer" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPostType("offer")}
                >
                  Offer
                </Button>
                <Button
                  type="button"
                  variant={postType === "request" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPostType("request")}
                >
                  Request
                </Button>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleImageSelect}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Photo
                </Button>
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={handleCancel} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={!content.trim() || isSubmitting} size="sm">
                  {isSubmitting ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
