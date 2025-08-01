"use client"

import { useState, useRef, type KeyboardEvent } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { comments as mockComments, users as mockUsers } from "@/lib/mock-data"

interface Comment {
  id: string
  postId?: string
  eventId?: string
  author: string
  content: string
  timestamp: string
  likes: number
  parentId?: string
}

interface CommentWithReplies extends Comment {
  replies?: CommentWithReplies[]
}

interface CommentFeedProps {
  postId?: string
  eventId?: string
  initialComments?: Comment[]
}

export function CommentFeed({ postId, eventId, initialComments }: CommentFeedProps) {
  const { toast } = useToast()
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [comments, setComments] = useState<CommentWithReplies[]>(() => {
    // If initialComments is provided, use it
    if (initialComments && initialComments.length > 0) {
      return organizeComments(initialComments)
    }

    // Otherwise, filter from mock data
    const filteredComments = mockComments.filter(
      (comment) => (postId && comment.postId === postId) || (eventId && comment.eventId === eventId),
    )

    return organizeComments(filteredComments)
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const commentInputRef = useRef<HTMLTextAreaElement>(null)
  const replyInputRef = useRef<HTMLTextAreaElement>(null)

  // Organize comments into a tree structure
  function organizeComments(commentsArray: Comment[]): CommentWithReplies[] {
    // Create a map of comments by ID
    const commentsMap = new Map<string, CommentWithReplies>()

    // First pass: create all comment objects
    commentsArray.forEach((comment) => {
      commentsMap.set(comment.id, {
        ...comment,
        replies: [],
      })
    })

    // Second pass: organize into parent-child relationships
    const rootComments: CommentWithReplies[] = []

    commentsArray.forEach((comment) => {
      const commentWithReplies = commentsMap.get(comment.id)!

      if (comment.parentId) {
        // This is a reply
        const parentComment = commentsMap.get(comment.parentId)
        if (parentComment) {
          if (!parentComment.replies) {
            parentComment.replies = []
          }
          parentComment.replies.push(commentWithReplies)
        } else {
          // Parent not found, add to root
          rootComments.push(commentWithReplies)
        }
      } else {
        // This is a root comment
        rootComments.push(commentWithReplies)
      }
    })

    // Sort by timestamp, newest first
    return rootComments.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  // Handle posting a new comment
  const handlePostComment = () => {
    if (!newComment.trim() || isSubmitting) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const newCommentObj: CommentWithReplies = {
        id: `comment-${Date.now()}`,
        postId,
        eventId,
        author: "user1", // Current user
        content: newComment,
        timestamp: new Date().toISOString(),
        likes: 0,
        replies: [],
      }

      setComments((prev) => [newCommentObj, ...prev])
      setNewComment("")
      setIsSubmitting(false)

      toast({
        title: "Comment posted",
        description: "Your comment has been posted successfully.",
      })
    }, 500)
  }

  // Handle posting a reply
  const handlePostReply = (parentId: string) => {
    if (!replyContent.trim() || isSubmitting) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const newReply: CommentWithReplies = {
        id: `reply-${Date.now()}`,
        postId,
        eventId,
        author: "user1", // Current user
        content: replyContent,
        timestamp: new Date().toISOString(),
        likes: 0,
        parentId,
      }

      // Add reply to the correct parent comment
      setComments((prevComments) => {
        // Create a deep copy of the comments array to avoid mutation issues
        const updatedComments = JSON.parse(JSON.stringify(prevComments)) as CommentWithReplies[]

        // Helper function to recursively find and update the parent comment
        const findAndAddReply = (comments: CommentWithReplies[], targetId: string): boolean => {
          for (let i = 0; i < comments.length; i++) {
            const comment = comments[i]

            // Check if this is the parent comment
            if (comment.id === targetId) {
              if (!comment.replies) {
                comment.replies = []
              }
              comment.replies.push(newReply)
              return true
            }

            // Check in replies
            if (comment.replies && comment.replies.length > 0) {
              if (findAndAddReply(comment.replies, targetId)) {
                return true
              }
            }
          }
          return false
        }

        findAndAddReply(updatedComments, parentId)
        return updatedComments
      })

      setReplyContent("")
      setReplyingTo(null)
      setIsSubmitting(false)

      toast({
        title: "Reply posted",
        description: "Your reply has been posted successfully.",
      })
    }, 500)
  }

  // Handle Enter key press for comments and replies
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>, isReply = false, parentId?: string) => {
    // Post on Enter without Shift key
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (isReply && parentId) {
        handlePostReply(parentId)
      } else {
        handlePostComment()
      }
    }
  }

  // Recursively render a comment with all its nested replies
  const renderCommentWithReplies = (comment: CommentWithReplies, depth = 0) => {
    const commentAuthor = mockUsers.find((user) => user.id === comment.author) || {
      name: "Unknown User",
      username: "unknown",
      avatar: undefined,
    }

    return (
      <div key={comment.id} className="mb-4">
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Link href={`/profile/${commentAuthor.username}`}>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={commentAuthor.avatar || "/placeholder.svg"} alt={commentAuthor.name} />
                  <AvatarFallback>{commentAuthor.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
              </Link>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <Link href={`/profile/${commentAuthor.username}`} className="font-medium hover:underline">
                      {commentAuthor.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <p className="mt-2">{comment.content}</p>

                <div className="mt-3 flex gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-muted-foreground px-2"
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Reply
                  </Button>
                </div>

                {/* Reply form */}
                {replyingTo === comment.id && (
                  <div className="mt-3">
                    <div className="flex gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/cameron-profile.png" alt="You" />
                        <AvatarFallback>YO</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          ref={replyInputRef}
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, true, comment.id)}
                          placeholder={`Reply to ${commentAuthor.name}...`}
                          className="min-h-[60px] p-2 text-sm"
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setReplyingTo(null)
                              setReplyContent("")
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handlePostReply(comment.id)}
                            disabled={!replyContent.trim() || isSubmitting}
                          >
                            {isSubmitting ? "Posting..." : "Reply"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Replies section */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3 border-l-2 border-gray-200 pl-4">
                    {comment.replies.map((reply) => renderCommentWithReplies(reply, depth + 1))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Comment form */}
      <div className="mb-6">
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/cameron-profile.png" alt="You" />
                <AvatarFallback>YO</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  ref={commentInputRef}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e)}
                  placeholder="Write a comment..."
                  className="min-h-[80px] resize-none"
                />
                <div className="flex justify-end mt-2">
                  <Button onClick={handlePostComment} disabled={!newComment.trim() || isSubmitting}>
                    {isSubmitting ? "Posting..." : "Post"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => renderCommentWithReplies(comment))
        ) : (
          <Card className="p-8">
            <p className="text-center text-gray-500">No comments yet. Be the first to start the conversation!</p>
          </Card>
        )}
      </div>
    </div>
  )
}
