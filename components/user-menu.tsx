"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  LogOut,
  User,
  Heart,
  Award,
  Clock,
  Briefcase,
  BookOpen,
  Users,
  MessageSquare,
  Pencil,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface UserMenuProps {
  open: boolean
  onClose: () => void
}

export function UserMenu({ open, onClose }: UserMenuProps) {
  const router = useRouter()

  const handleLogout = () => {
    // In a real app, this would log the user out
    onClose()
    router.push("/auth/login")
  }

  const handleNavigation = (path: string) => {
    router.push(path)
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <div className="flex items-center gap-4 mb-4">
            <Avatar
              className="h-16 w-16 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
              onClick={() => handleNavigation("/profile")}
            >
              <AvatarImage src="/placeholder.svg?height=64&width=64" alt="@user" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg">Jane Doe</h3>
              <p className="text-sm text-muted-foreground">@janedoe</p>
            </div>
          </div>
          <Separator className="my-4" />
          <nav className="flex flex-col gap-2">
            <Link
              href="/profile"
              onClick={() => handleNavigation("/profile")}
              className="flex items-center gap-3 p-2 hover:bg-muted rounded-md transition-colors"
            >
              <User className="h-5 w-5" />
              <span>My Profile</span>
            </Link>
            <Link
              href="/profile/edit"
              onClick={() => handleNavigation("/profile/edit")}
              className="flex items-center gap-3 p-2 hover:bg-muted rounded-md transition-colors"
            >
              <Pencil className="h-5 w-5" />
              <span>Edit Profile</span>
            </Link>
            <Link
              href="/profile/settings"
              onClick={() => handleNavigation("/profile/settings")}
              className="flex items-center gap-3 p-2 hover:bg-muted rounded-md transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span>Profile Settings</span>
            </Link>
            <Link
              href="/points"
              onClick={() => handleNavigation("/points")}
              className="flex items-center gap-3 p-2 hover:bg-muted rounded-md transition-colors"
            >
              <Award className="h-5 w-5" />
              <span>Points & Badges</span>
            </Link>
            <Link
              href="/thanks"
              onClick={() => handleNavigation("/thanks")}
              className="flex items-center gap-3 p-2 hover:bg-muted rounded-md transition-colors"
            >
              <Heart className="h-5 w-5" />
              <span>Thanks Received</span>
            </Link>
            <Link
              href="/shifts"
              onClick={() => handleNavigation("/shifts")}
              className="flex items-center gap-3 p-2 hover:bg-muted rounded-md transition-colors"
            >
              <Clock className="h-5 w-5" />
              <span>My Shifts</span>
            </Link>
            <Link
              href="/tasks"
              onClick={() => handleNavigation("/tasks")}
              className="flex items-center gap-3 p-2 hover:bg-muted rounded-md transition-colors"
            >
              <Briefcase className="h-5 w-5" />
              <span>My Tasks</span>
            </Link>
            <Link
              href="/skills"
              onClick={() => handleNavigation("/skills")}
              className="flex items-center gap-3 p-2 hover:bg-muted rounded-md transition-colors"
            >
              <BookOpen className="h-5 w-5" />
              <span>Skills & Resources</span>
            </Link>
            <Link
              href="/groups"
              onClick={() => handleNavigation("/groups")}
              className="flex items-center gap-3 p-2 hover:bg-muted rounded-md transition-colors"
            >
              <Users className="h-5 w-5" />
              <span>My Groups</span>
            </Link>
            <Link
              href="/messages"
              onClick={() => handleNavigation("/messages")}
              className="flex items-center gap-3 p-2 hover:bg-muted rounded-md transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Messages</span>
            </Link>
            <Link
              href="/calendar"
              onClick={() => handleNavigation("/calendar")}
              className="flex items-center gap-3 p-2 hover:bg-muted rounded-md transition-colors"
            >
              <Calendar className="h-5 w-5" />
              <span>My Calendar</span>
            </Link>
            <Separator className="my-2" />
            <Link
              href="/settings"
              onClick={() => handleNavigation("/settings")}
              className="flex items-center gap-3 p-2 hover:bg-muted rounded-md transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
            <Button variant="outline" className="mt-2 w-full justify-start gap-3" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span>Log Out</span>
            </Button>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
