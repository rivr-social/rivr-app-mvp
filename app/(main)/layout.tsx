"use client"

import type React from "react"
import { AppProvider } from "@/contexts/app-context"
import { BottomNav } from "@/components/bottom-nav"

// Add the following imports at the top:
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

// Modify the MainLayout component to include a redirect
export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Only redirect /events to home page, keep /explore
    if (pathname?.startsWith("/events")) {
      router.replace("/")
    }
  }, [pathname, router])

  return (
    <AppProvider>
      <div className="min-h-screen">
        {children}
        <BottomNav />
      </div>
    </AppProvider>
  )
}
