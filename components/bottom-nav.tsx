"use client"

import { Home, Map, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      active: pathname === "/" || pathname === "/home",
    },
    {
      name: "Map",
      href: "/map",
      icon: Map,
      active: pathname === "/map",
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      active: pathname === "/profile" || pathname.startsWith("/profile/"),
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg h-16">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-xs",
              item.active ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
