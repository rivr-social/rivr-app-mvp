"use client"

import Link from "next/link"

interface Person {
  id: string
  name: string
  username: string
  avatar?: string
  bio: string
  skills: string[]
  points: number
  location?: {
    lat: number
    lng: number
  }
  chapterTags?: string[]
  groupTags?: string[]
}

interface PeopleFeedProps {
  people?: Person[]
  query?: string
  chapterId?: string
  initialConnections?: string[]
  maxPeople?: number
  chapters?: Array<{ id: string; name: string }>
  groups?: Array<{ id: string; name: string }>
  showGrid?: boolean
  showFilters?: boolean
}

export function PeopleFeed({ people = [] }: PeopleFeedProps) {
  if (people.length === 0) {
    return <div className="text-center py-8 text-gray-500">No people found</div>
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6">
      {people.map((person) => (
        <Link
          key={person.id}
          href={`/profile/${person.username}`}
          className="flex flex-col items-center space-y-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
            <img
              src={person.avatar || "/placeholder.svg?height=64&width=64"}
              alt={person.name}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-sm font-medium text-center text-gray-900 leading-tight">{person.name}</span>
        </Link>
      ))}
    </div>
  )
}
