"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, Shield, User, Globe, Moon, Sun } from "lucide-react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" className="p-0" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="account" className="space-y-4">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg?height=80&width=80" alt="@user" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">Jane Doe</h2>
              <p className="text-muted-foreground">@janedoe</p>
              <Button size="sm" variant="outline" className="mt-2">
                Change Photo
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Name</label>
              <input type="text" className="p-2 border rounded-md" defaultValue="Jane Doe" />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Username</label>
              <input type="text" className="p-2 border rounded-md" defaultValue="janedoe" />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Email</label>
              <input type="email" className="p-2 border rounded-md" defaultValue="jane.doe@example.com" />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Phone</label>
              <input type="tel" className="p-2 border rounded-md" defaultValue="+1 (555) 123-4567" />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Bio</label>
              <textarea
                className="p-2 border rounded-md"
                rows={3}
                defaultValue="Community organizer and event planner"
              />
            </div>

            <Button className="w-full">Save Changes</Button>
          </div>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Profile Visibility</p>
                  <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                </div>
              </div>
              <select className="p-2 border rounded-md">
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Friend Requests</p>
                  <p className="text-sm text-muted-foreground">Control who can send you friend requests</p>
                </div>
              </div>
              <select className="p-2 border rounded-md">
                <option value="everyone">Everyone</option>
                <option value="friends-of-friends">Friends of Friends</option>
                <option value="nobody">Nobody</option>
              </select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Location Sharing</p>
                  <p className="text-sm text-muted-foreground">Control when your location is shared</p>
                </div>
              </div>
              <select className="p-2 border rounded-md">
                <option value="always">Always</option>
                <option value="events">During Events Only</option>
                <option value="never">Never</option>
              </select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
              </div>
              <Switch />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Event Reminders</p>
                <p className="text-sm text-muted-foreground">Get reminded about upcoming events</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Messages</p>
                <p className="text-sm text-muted-foreground">Get notified when you receive new messages</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Toggle between light and dark mode</p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            <Separator />

            <div>
              <p className="font-medium mb-2">Text Size</p>
              <div className="flex items-center gap-4">
                <span className="text-sm">A</span>
                <input type="range" min="1" max="5" defaultValue="3" className="flex-1" />
                <span className="text-lg">A</span>
              </div>
            </div>

            <Separator />

            <div>
              <p className="font-medium mb-2">Color Theme</p>
              <div className="grid grid-cols-5 gap-2">
                <div className="h-10 w-10 rounded-full bg-primary cursor-pointer ring-2 ring-offset-2 ring-primary"></div>
                <div className="h-10 w-10 rounded-full bg-blue-500 cursor-pointer"></div>
                <div className="h-10 w-10 rounded-full bg-green-500 cursor-pointer"></div>
                <div className="h-10 w-10 rounded-full bg-purple-500 cursor-pointer"></div>
                <div className="h-10 w-10 rounded-full bg-pink-500 cursor-pointer"></div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
