"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface FollowButtonProps {
  objectId: string
  objectType: "post" | "event" | "group" | "person"
  isJoined?: boolean // Only relevant for groups
  onFollowChange?: (followed: boolean, preferences: FollowPreferences) => void
  initialFollowed?: boolean
  initialPreferences?: FollowPreferences
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export interface FollowPreferences {
  email: boolean
  push: boolean
}

export function FollowButton({
  objectId,
  objectType,
  isJoined = true, // Default to true for non-group objects
  onFollowChange,
  initialFollowed = false,
  initialPreferences = { email: true, push: true },
  size = "default",
  variant = "outline",
}: FollowButtonProps) {
  const [isFollowed, setIsFollowed] = useState(initialFollowed)
  const [preferences, setPreferences] = useState<FollowPreferences>(initialPreferences)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  // For groups, we need to check if the user has joined
  const canFollow = objectType !== "group" || isJoined

  const handleFollowClick = () => {
    if (!canFollow) {
      toast({
        title: "Join group first",
        description: "You need to join this group before you can follow it.",
        duration: 3000,
      })
      return
    }

    if (!isFollowed) {
      // If not currently following, open the popover to select preferences
      setIsOpen(true)
    } else {
      // If already following, unfollow directly
      setIsFollowed(false)
      if (onFollowChange) {
        onFollowChange(false, preferences)
      }
      toast({
        title: "Unfollowed",
        description: `You will no longer receive notifications for this ${objectType}.`,
        duration: 3000,
      })
    }
  }

  const handleSavePreferences = () => {
    setIsFollowed(true)
    setIsOpen(false)
    if (onFollowChange) {
      onFollowChange(true, preferences)
    }
    toast({
      title: "Following",
      description: `You will now receive notifications for this ${objectType}.`,
      duration: 3000,
    })
  }

  const handlePreferenceChange = (type: keyof FollowPreferences, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [type]: value }))
  }

  return (
    <Popover open={isOpen && canFollow} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={isFollowed ? "default" : variant}
          size={size}
          onClick={handleFollowClick}
          className={isFollowed ? "bg-primary hover:bg-primary/90" : ""}
        >
          <Bell className="h-4 w-4 mr-2" />
          {isFollowed ? "Following" : "Follow"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Notification Preferences</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="flex-1">
                Email Notifications
              </Label>
              <Switch
                id="email-notifications"
                checked={preferences.email}
                onCheckedChange={(checked) => handlePreferenceChange("email", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications" className="flex-1">
                Mobile Notifications
              </Label>
              <Switch
                id="push-notifications"
                checked={preferences.push}
                onCheckedChange={(checked) => handlePreferenceChange("push", checked)}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSavePreferences}>Save Preferences</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
