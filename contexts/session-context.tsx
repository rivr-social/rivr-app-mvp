"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { users } from "@/lib/mock-data"

// Define the session type
type User = {
  id: string
  name: string
  email: string
  image?: string
}

type SessionContextType = {
  user: User | null
  status: "authenticated" | "unauthenticated" | "loading"
  signIn: (credentials: { username: string; password: string }) => Promise<boolean>
  signOut: () => void
}

// Create the context
const SessionContext = createContext<SessionContextType>({
  user: null,
  status: "unauthenticated",
  signIn: async () => false,
  signOut: () => {},
})

// Create a provider component
export function MockSessionProvider({ children }: { children: React.ReactNode }) {
  // For the mock version, we'll start with a logged-in user
  const [user, setUser] = useState<User | null>({
    id: users[0].id,
    name: users[0].name,
    email: users[0].email,
    image: users[0].avatar,
  })

  const signIn = async (credentials: { username: string; password: string }) => {
    // Mock authentication - in a real app, you'd verify credentials
    const foundUser = users.find((u) => u.username === credentials.username || u.email === credentials.username)

    if (foundUser) {
      setUser({
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        image: foundUser.avatar,
      })
      return true
    }

    return false
  }

  const signOut = () => {
    setUser(null)
  }

  return (
    <SessionContext.Provider
      value={{
        user,
        status: user ? "authenticated" : "unauthenticated",
        signIn,
        signOut,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

// Create a hook to use the session context
export function useSession() {
  return useContext(SessionContext)
}
