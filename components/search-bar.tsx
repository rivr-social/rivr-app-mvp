"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search, MapPin, Users, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { chapters, posts, users, groups, projects } from "@/lib/mock-data"

interface SearchBarProps {
  onChapterSelect?: (chapterId: string) => void
  selectedChapter?: string
  placeholder?: string
}

export function SearchBar({
  onChapterSelect,
  selectedChapter = "all",
  placeholder = "Search chapters, posts, people...",
}: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Filter chapters based on query
  const filteredChapters = query
    ? chapters.filter(
        (chapter) =>
          chapter.name.toLowerCase().includes(query.toLowerCase()) ||
          chapter.id.toLowerCase().includes(query.toLowerCase()),
      )
    : []

  // Filter posts based on query
  const filteredPosts = query
    ? posts
        .filter((post) => post.content.toLowerCase().includes(query.toLowerCase()))
        .filter((post) => selectedChapter === "all" || post.chapterTags.includes(selectedChapter))
        .slice(0, 3)
    : []

  // Filter users based on query
  const filteredUsers = query
    ? users
        .filter(
          (user) =>
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.username.toLowerCase().includes(query.toLowerCase()),
        )
        .filter((user) => selectedChapter === "all" || user.chapterTags.includes(selectedChapter))
        .slice(0, 3)
    : []

  // Filter groups based on query
  const filteredGroups = query
    ? groups
        .filter(
          (group) =>
            group.name.toLowerCase().includes(query.toLowerCase()) ||
            group.description.toLowerCase().includes(query.toLowerCase()),
        )
        .filter((group) => selectedChapter === "all" || group.chapterTags.includes(selectedChapter))
        .slice(0, 3)
    : []

  // Filter events based on query
  const filteredEvents = query
    ? projects
        .filter(
          (project) =>
            project.name.toLowerCase().includes(query.toLowerCase()) ||
            project.description.toLowerCase().includes(query.toLowerCase()),
        )
        .filter((project) => selectedChapter === "all" || project.chapterTags.includes(selectedChapter))
        .slice(0, 3)
    : []

  // Combine all results
  const allResults = [
    ...filteredChapters.map((chapter) => ({ type: "chapter", item: chapter })),
    ...filteredPosts.map((post) => ({ type: "post", item: post })),
    ...filteredUsers.map((user) => ({ type: "user", item: user })),
    ...filteredGroups.map((group) => ({ type: "group", item: group })),
    ...filteredEvents.map((event) => ({ type: "event", item: event })),
  ]

  // Sort results to prioritize chapters
  const sortedResults = [
    ...allResults.filter((result) => result.type === "chapter"),
    ...allResults.filter((result) => result.type !== "chapter"),
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setIsOpen(true)
    setActiveIndex(0)
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const handleInputBlur = () => {
    // Delay closing to allow for click events on results
    setTimeout(() => {
      setIsOpen(false)
    }, 200)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((prev) => (prev < sortedResults.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (sortedResults[activeIndex]) {
        handleResultClick(sortedResults[activeIndex])
      }
    } else if (e.key === "Escape") {
      e.preventDefault()
      setIsOpen(false)
    }
  }

  const handleResultClick = (result: { type: string; item: any }) => {
    setIsOpen(false)
    setQuery("")

    if (result.type === "chapter") {
      if (onChapterSelect) {
        onChapterSelect(result.item.id)
      }
    } else if (result.type === "post") {
      router.push(`/posts/${result.item.id}`)
    } else if (result.type === "user") {
      router.push(`/profile/${result.item.username}`)
    } else if (result.type === "group") {
      router.push(`/groups/${result.item.id}`)
    } else if (result.type === "event") {
      router.push(`/events/${result.item.id}`)
    }
  }

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/explore?q=${encodeURIComponent(query)}&chapter=${selectedChapter}`)
      setIsOpen(false)
    }
  }

  // Scroll active item into view
  useEffect(() => {
    if (isOpen && resultsRef.current) {
      const activeItem = resultsRef.current.querySelector(`[data-index="${activeIndex}"]`)
      if (activeItem) {
        activeItem.scrollIntoView({ block: "nearest" })
      }
    }
  }, [activeIndex, isOpen])

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className="pl-10 pr-4 py-2"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-primary hover:underline"
            onClick={handleSearch}
          >
            Search
          </button>
        )}
      </div>

      {isOpen && sortedResults.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg max-h-[400px] overflow-y-auto"
        >
          {sortedResults.map((result, index) => {
            const isActive = index === activeIndex

            if (result.type === "chapter") {
              const chapter = result.item
              return (
                <div
                  key={`chapter-${chapter.id}`}
                  className={`flex items-center p-3 cursor-pointer ${isActive ? "bg-muted" : "hover:bg-muted/50"}`}
                  onClick={() => handleResultClick(result)}
                  data-index={index}
                >
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src={chapter.image || "/placeholder.svg"} alt={chapter.name} />
                    <AvatarFallback>{chapter.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="font-medium">{chapter.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{chapter.memberCount} members</p>
                  </div>
                </div>
              )
            } else if (result.type === "user") {
              const user = result.item
              return (
                <div
                  key={`user-${user.id}`}
                  className={`flex items-center p-3 cursor-pointer ${isActive ? "bg-muted" : "hover:bg-muted/50"}`}
                  onClick={() => handleResultClick(result)}
                  data-index={index}
                >
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                  </div>
                </div>
              )
            } else if (result.type === "group") {
              const group = result.item
              return (
                <div
                  key={`group-${group.id}`}
                  className={`flex items-center p-3 cursor-pointer ${isActive ? "bg-muted" : "hover:bg-muted/50"}`}
                  onClick={() => handleResultClick(result)}
                  data-index={index}
                >
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src={group.avatar || "/placeholder.svg"} alt={group.name} />
                    <AvatarFallback>{group.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="font-medium">{group.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{group.description}</p>
                  </div>
                </div>
              )
            } else if (result.type === "event") {
              const event = result.item
              return (
                <div
                  key={`event-${event.id}`}
                  className={`flex items-center p-3 cursor-pointer ${isActive ? "bg-muted" : "hover:bg-muted/50"}`}
                  onClick={() => handleResultClick(result)}
                  data-index={index}
                >
                  <div className="h-8 w-8 mr-3 bg-muted rounded-md flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{event.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.timeframe.start).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )
            } else {
              const post = result.item
              const postAuthor = users.find((u) => u.id === post.author)
              return (
                <div
                  key={`post-${post.id}`}
                  className={`flex items-center p-3 cursor-pointer ${isActive ? "bg-muted" : "hover:bg-muted/50"}`}
                  onClick={() => handleResultClick(result)}
                  data-index={index}
                >
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src={postAuthor?.avatar || "/placeholder.svg"} alt={postAuthor?.name} />
                    <AvatarFallback>{postAuthor?.name.substring(0, 2) || "UN"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{postAuthor?.name || "Unknown User"}</p>
                    <p className="text-xs text-muted-foreground truncate">{post.content}</p>
                  </div>
                </div>
              )
            }
          })}
        </div>
      )}
    </div>
  )
}
