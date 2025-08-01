"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { mockEvents } from "@/lib/mock-data"

interface CreateEventButtonProps {
  groupId: string
  onEventCreated?: (event: any) => void
  buttonText?: string
}

export function CreateEventButton({ groupId, onEventCreated, buttonText = "Create Event" }: CreateEventButtonProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "",
    isVirtual: false,
    price: "0",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isVirtual: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.startDate || !formData.startTime) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Format dates
    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`)
    const endDateTime =
      formData.endDate && formData.endTime
        ? new Date(`${formData.endDate}T${formData.endTime}`)
        : new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000) // Default to 2 hours later

    // Create event object
    const newEvent = {
      id: `event-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      location: {
        address: formData.location || (formData.isVirtual ? "Online" : "TBD"),
      },
      organizer: groupId,
      groupId: groupId,
      image: "/community-event.png",
      chapterTags: [],
      type: "event",
      timeframe: {
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
      },
      price: Number.parseInt(formData.price) || 0,
      admins: ["user1"], // Current user
      creatorId: "user1",
      virtual: formData.isVirtual,
      createdAt: new Date().toISOString(),
    }

    // Add to mock data
    mockEvents.unshift(newEvent)

    // Simulate API call
    setTimeout(() => {
      if (onEventCreated) {
        onEventCreated(newEvent)
      }

      setIsSubmitting(false)
      setOpen(false)

      // Reset form
      setFormData({
        name: "",
        description: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        location: "",
        isVirtual: false,
        price: "0",
      })

      toast({
        title: "Event created",
        description: "Your event has been created successfully.",
      })
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>Fill in the details below to create a new event for your group.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Event Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter event name"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What's this event about?"
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input id="endTime" name="endTime" type="time" value={formData.endTime} onChange={handleChange} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder={formData.isVirtual ? "Meeting link or platform" : "Physical location"}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="isVirtual" checked={formData.isVirtual} onCheckedChange={handleCheckboxChange} />
              <Label htmlFor="isVirtual" className="cursor-pointer">
                This is a virtual event
              </Label>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="0 for free events"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
