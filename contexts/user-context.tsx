"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { users } from "@/lib/mock-data"
import type { User } from "@/lib/types"

interface UserContextType {
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  isCreator: (creatorId: string | undefined) => boolean
  isAdmin: (adminIds: string[] | undefined) => boolean
  isSuperAdmin: () => boolean
}

const UserContext = createContext<UserContextType>({
  currentUser: null,
  setCurrentUser: () => {},
  isCreator: () => false,
  isAdmin: () => false,
  isSuperAdmin: () => false,
})

export function UserProvider({ children }: { children: ReactNode }) {
  // Default to Cameron Murdock as the current user
  const [currentUser, setCurrentUser] = useState<User | null>(users.find((user) => user.id === "cameron") || null)

  const isCreator = (creatorId: string | undefined) => {
    if (!currentUser || !creatorId) return false
    return currentUser.id === creatorId
  }

  const isAdmin = (adminIds: string[] | undefined) => {
    if (!currentUser || !adminIds) return false
    return adminIds.includes(currentUser.id)
  }

  const isSuperAdmin = () => {
    if (!currentUser) return false
    return currentUser.role === "superadmin"
  }

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, isCreator, isAdmin, isSuperAdmin }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
