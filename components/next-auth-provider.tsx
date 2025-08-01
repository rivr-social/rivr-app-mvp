"use client"

import { SessionProvider } from "next-auth/react"
import type React from "react"

export function NextAuthProvider({ children }: { children: React.ReactNode }) {
  // Using the SessionProvider with a custom session to avoid API calls
  return (
    <SessionProvider
      session={{
        user: {
          name: "Demo User",
          email: "user@example.com",
          image: "/cameron-profile.png",
        },
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }}
    >
      {children}
    </SessionProvider>
  )
}
