"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { MessageCircle, ChevronLeft, Heart, Plus, Minus, ArrowRight } from "lucide-react"
import { posts, users } from "@/lib/mock-data"
import Image from "next/image"
import Link from "next/link"
import { FollowButton } from "@/components/follow-button"
import { CommentFeed } from "@/components/comment-feed"

export default function PostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [thanked, setThanked] = useState(false)
  const [showThanksModal, setShowThanksModal] = useState(false)
  const [thanksCount, setThanksCount] = useState(10)

  // Find post by ID
  const post = posts.find((p) => p.id === params.id) || posts[0]

  // Get author
  const author = users.find((u) => u.id === post.author) || users[0]

  // Format date
  const formattedDate = new Date(post.timestamp).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const handleThank = () => {
    setThanked(!thanked)
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6">
      <Button variant="ghost" className="mb-4 pl-0" onClick={() => router.back()}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card className="overflow-hidden border shadow-sm mb-6">
        <CardContent className="p-0">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Link href={`/profile/${author.username}`}>
                  <Avatar className="h-12 w-12 hover:ring-2 hover:ring-primary transition-all">
                    <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
                    <AvatarFallback>{author.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link href={`/profile/${author.username}`} className="font-medium hover:underline">
                    {author.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">{formattedDate}</p>
                </div>
              </div>
              <FollowButton objectId={post.id} objectType="post" size="sm" />
            </div>
            <p className="mb-3 text-lg">{post.content}</p>
          </div>

          {post.images && post.images.length > 0 && (
            <div className="relative w-full h-96">
              <Image src={post.images[0] || "/placeholder.svg"} alt="Post image" fill className="object-cover" />
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 border-t flex flex-col">
          <div className="flex items-center justify-between w-full mb-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">{post.comments} comments</span>
              <span>•</span>
              <span className="font-medium">{thanked ? "You thanked this post" : ""}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 w-full border-t border-b py-2">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-none h-12 text-muted-foreground"
              onClick={() => document.getElementById("comment-input")?.focus()}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Comment
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-none h-12 text-muted-foreground flex items-center gap-2"
              onClick={() => setShowThanksModal(true)}
            >
              <div className="flex items-center gap-1">
                <span className="text-lg">🙏</span>
                <span className="font-medium">{post.thanks || 0}</span>
              </div>
            </Button>
          </div>

          {/* Thanks Modal */}
          {showThanksModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setShowThanksModal(false)}
            >
              <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-semibold text-center mb-6">Give some Thanks</h3>

                <div className="flex items-center justify-center gap-4 mb-6">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-12 w-12"
                    onClick={() => setThanksCount(Math.max(0, thanksCount - 1))}
                    disabled={thanksCount <= 0}
                  >
                    <Minus className="h-6 w-6" />
                  </Button>

                  <div className="flex items-center gap-2">
                    <Heart className="h-8 w-8 text-red-500" />
                    <span className="text-3xl font-bold">{thanksCount}</span>
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-12 w-12"
                    onClick={() => setThanksCount(thanksCount + 1)}
                  >
                    <Plus className="h-6 w-6" />
                  </Button>
                </div>

                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
                  onClick={() => {
                    handleThank()
                    setShowThanksModal(false)
                  }}
                  disabled={thanksCount === 0}
                >
                  Give
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Comments section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Comments</h2>
        <CommentFeed postId={params.id} />
      </div>
    </div>
  )
}
