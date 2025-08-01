// Core entity types
export interface User {
  id: string
  name: string
  username: string
  email: string
  bio: string
  avatar: string
  followers: string[]
  following: string[]
  joinedAt: string
  location: string
  skills: string[]
  points: number
  chapterTags: string[]
  groupTags: string[]
}

// Modify Group interface:
export interface Group {
  id: string
  name: string
  description: string // Used for "details"
  summary?: string // New field for a shorter summary
  venue?: string // New field for venue
  members: string[] // User IDs
  admins: string[] // User IDs
  creatorId: string
  avatar?: string // URL for the group image
  coverImage?: string // Optional
  chapterTags: string[] // Chapter IDs
  parentGroupId?: string
  location?: {
    city: string // For "location" field
    lat?: number
    lng?: number
  }
  isPublic?: boolean
  tags?: string[] // General tags, if any
  createdAt: string
  type?: string
  color?: string
}

export interface Chapter {
  id: string
  name: string
  description?: string
  location: {
    city: string
    state?: string
    country: string
    coordinates?: {
      lat: number
      lng: number
    }
    address?: string
  }
  leaderId?: string
  adminIds?: string[]
  directors: string[] // Exactly 3 directors
  members: string[]
  createdAt?: string
  image?: string
  coverImage?: string
  color?: string
  tags?: string[]
  memberCount: number
  parentChapterId?: string // For subchapters
  affiliatedChapters?: string[] // For affiliated chapters
  creatorId: string // Who created the chapter
  posts?: string[] // Associated posts
  events?: string[] // Associated events
  groups?: string[] // Associated groups
}

export interface Post {
  id: string
  content: string
  authorId: string
  createdAt: string
  likes: number
  comments: number
  shares: number
  images?: string[]
  tags?: string[]
  groupId?: string
  eventId?: string
  chapterId?: string
}

export interface Event {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  location: string
  organizerId: string
  attendees?: string[]
  image?: string
  tags?: string[]
  price?: number
  capacity?: number
  groupId?: string
  chapterId?: string
  virtual?: boolean
  link?: string
}

export interface OfferRequest {
  id: string
  type: "offer" | "request"
  user: string
  title: string
  description: string
  category: string
  timeframe: Timeframe
  location: Location
  chapterTags: string[]
  groupTags: string[]
}

export interface Resource {
  id: string
  name: string
  description: string
  owner: string
  available: boolean
  category: string
  chapterTags: string[]
  groupTags: string[]
}

// Supporting types
export interface Location {
  lat: number
  lng: number
  address?: string
}

export interface Timeframe {
  start: string
  end: string
}

// Group relationship types
export interface GroupRelationship {
  sourceGroupId: string
  targetGroupId: string
  type: "subgroup" | "affiliate" | "partner" | "coalition"
  description?: string
  createdAt: string
  createdBy: string
}

// Chapter relationship types
export interface ChapterRelationship {
  sourceChapterId: string
  targetChapterId: string
  type: "subchapter" | "affiliate" | "partner" | "coalition"
  description?: string
  createdAt: string
  createdBy: string
}

// UI-specific types
export interface SearchResult {
  id: string
  type: "post" | "group" | "user" | "event" | "chapter" | "resource" | "offer" | "request"
  title: string
  subtitle?: string
  image?: string
  chapter: string | string[]
}

export interface RsvpStatus {
  eventId: string
  status: "going" | "maybe" | "none"
}

// Context types
export interface AppState {
  currentUser?: User
  selectedChapter: string
  likedPosts: string[]
  rsvpStatuses: Record<string, "going" | "maybe" | "none">
  joinedGroups: string[]
  followedUsers: string[]
}

export interface AppContextType {
  state: AppState
  setSelectedChapter: (chapterId: string) => void
  toggleLikePost: (postId: string) => void
  setRsvpStatus: (eventId: string, status: "going" | "maybe" | "none") => void
  toggleJoinGroup: (groupId: string) => void
  toggleFollowUser: (userId: string) => void
}

export interface Message {
  id: string
  content: string
  senderId: string
  receiverId?: string
  groupId?: string
  createdAt: string
  read: boolean
  attachments?: string[]
}

export interface Comment {
  id: string
  postId: string
  author: string
  content: string
  timestamp: string
  likes: number
}
