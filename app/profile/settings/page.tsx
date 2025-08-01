"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, Bell, Shield, Globe, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

export default function ProfileSettingsPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    profileVisibility: "public",
    locationSharing: "events",
    messagePermissions: "everyone",
    eventReminders: true,
    newMessages: true,
    groupUpdates: true,
    mentionAlerts: true,
  })

  const handleToggle = (setting: string) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }))

    toast({
      title: "Setting updated",
      description: `Your ${setting.replace(/([A-Z])/g, " $1").toLowerCase()} setting has been updated.`,
    })
  }

  const handleSelectChange = (setting: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))

    toast({
      title: "Setting updated",
      description: `Your ${setting.replace(/([A-Z])/g, " $1").toLowerCase()} setting has been updated.`,
    })
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" className="p-0" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
      </div>

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={() => handleToggle("emailNotifications")}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                </div>
              </div>
              <Switch checked={settings.pushNotifications} onCheckedChange={() => handleToggle("pushNotifications")} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
                </div>
              </div>
              <Switch checked={settings.smsNotifications} onCheckedChange={() => handleToggle("smsNotifications")} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Event Reminders</p>
                  <p className="text-sm text-muted-foreground">Get reminded about upcoming events</p>
                </div>
              </div>
              <Switch checked={settings.eventReminders} onCheckedChange={() => handleToggle("eventReminders")} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">New Messages</p>
                  <p className="text-sm text-muted-foreground">Get notified when you receive new messages</p>
                </div>
              </div>
              <Switch checked={settings.newMessages} onCheckedChange={() => handleToggle("newMessages")} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Group Updates</p>
                  <p className="text-sm text-muted-foreground">Get notified about updates in your groups</p>
                </div>
              </div>
              <Switch checked={settings.groupUpdates} onCheckedChange={() => handleToggle("groupUpdates")} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Mention Alerts</p>
                  <p className="text-sm text-muted-foreground">Get notified when someone mentions you</p>
                </div>
              </div>
              <Switch checked={settings.mentionAlerts} onCheckedChange={() => handleToggle("mentionAlerts")} />
            </div>
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
              <select
                className="p-2 border rounded-md"
                value={settings.profileVisibility}
                onChange={(e) => handleSelectChange("profileVisibility", e.target.value)}
              >
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
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
              <select
                className="p-2 border rounded-md"
                value={settings.locationSharing}
                onChange={(e) => handleSelectChange("locationSharing", e.target.value)}
              >
                <option value="always">Always</option>
                <option value="events">During Events Only</option>
                <option value="never">Never</option>
              </select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Message Permissions</p>
                  <p className="text-sm text-muted-foreground">Control who can send you messages</p>
                </div>
              </div>
              <select
                className="p-2 border rounded-md"
                value={settings.messagePermissions}
                onChange={(e) => handleSelectChange("messagePermissions", e.target.value)}
              >
                <option value="everyone">Everyone</option>
                <option value="friends">Friends Only</option>
                <option value="nobody">Nobody</option>
              </select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <div className="space-y-4">
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2">Account Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span>jane.doe@example.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member Since</span>
                  <span>January 15, 2023</span>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" onClick={() => router.push("/profile/edit")}>
                  Edit Profile
                </Button>
              </div>
            </div>

            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2">Connected Accounts</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Google</span>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <span>Facebook</span>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <span>Apple</span>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-md border-red-200 bg-red-50">
              <h3 className="font-medium mb-2 text-red-600">Danger Zone</h3>
              <div className="space-y-2">
                <div>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-100">
                    Deactivate Account
                  </Button>
                </div>
                <div>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-100">
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
