"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { User } from "@/lib/types"
import { mockUsers } from "@/lib/mock-data"

// Create a session context
type SessionContextType = {
  session: {
    user: User | null
    status: "loading" | "authenticated" | "unauthenticated"
  }
  signIn: (credentials: { username: string; password: string }) => Promise<boolean>
  signOut: () => void
}

const SessionContext = createContext<SessionContextType>({
  session: {
    user: null,
    status: "loading",
  },
  signIn: async () => false,
  signOut: () => {},
})

// Custom hook to use the session
export const useSession = () => {
  return useContext(SessionContext)
}

// Session Provider component
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionContextType["session"]>({
    user: null,
    status: "loading",
  })
  const router = useRouter()
  const pathname = usePathname()

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("onelocal_user")
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setSession({
          user,
          status: "authenticated",
        })
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        setSession({
          user: null,
          status: "unauthenticated",
        })
        localStorage.removeItem("onelocal_user")
      }
    } else {
      setSession({
        user: null,
        status: "unauthenticated",
      })
    }
  }, [])

  // Redirect to login if not authenticated and not on auth pages
  useEffect(() => {
    if (session.status === "unauthenticated" && !pathname?.startsWith("/auth") && pathname !== "/") {
      router.push("/auth/login")
    }
  }, [session.status, pathname, router])

  // Sign in function
  const signIn = async (credentials: { username: string; password: string }) => {
    // In a real app, this would make an API call
    // For this mock, we'll just check against our mock data
    const user = mockUsers.find((u) => u.username === credentials.username || u.email === credentials.username)

    if (user) {
      // In a real app, we would verify the password here
      setSession({
        user,
        status: "authenticated",
      })
      localStorage.setItem("onelocal_user", JSON.stringify(user))
      return true
    }

    return false
  }

  // Sign out function
  const signOut = () => {
    setSession({
      user: null,
      status: "unauthenticated",
    })
    localStorage.removeItem("onelocal_user")
    router.push("/auth/login")
  }

  return <SessionContext.Provider value={{ session, signIn, signOut }}>{children}</SessionContext.Provider>
}
