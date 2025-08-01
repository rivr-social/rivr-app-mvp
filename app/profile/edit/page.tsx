"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, Camera, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { users } from "@/lib/mock-data"
import { useToast } from "@/components/ui/use-toast"

export default function EditProfilePage() {
  const router = useRouter()
  const { toast } = useToast()

  // Use the first user as an example
  const user = users[0]

  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    bio: user.bio,
    location: "Boulder, Colorado",
    skills: user.skills.join(", "),
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    })

    setIsSubmitting(false)
    router.push("/profile")
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" className="p-0" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Edit Profile</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <Avatar className="h-24 w-24 border-2 border-white">
              <AvatarImage src={user.avatar || "/placeholder.svg?height=96&width=96"} alt={user.name} />
              <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
            >
              <Camera className="h-4 w-4" />
              <span className="sr-only">Change profile picture</span>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="grid gap-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <Input id="username" name="username" value={formData.username} onChange={handleChange} required />
          </div>

          <div className="grid gap-2">
            <label htmlFor="bio" className="text-sm font-medium">
              Bio
            </label>
            <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={4} />
          </div>

          <div className="grid gap-2">
            <label htmlFor="location" className="text-sm font-medium">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="skills" className="text-sm font-medium">
              Skills (comma separated)
            </label>
            <Input
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. gardening, cooking, programming"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Current Skills</label>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
