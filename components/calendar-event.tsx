"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Check, Briefcase, Users, Pencil, Ticket, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

interface CalendarEventProps {
  event: {
    id: string
    name: string
    projectName?: string
    groupName?: string
    start: Date
    end: Date
    location?: string
    type: string
    color?: string
    colorClass?: string
    ticketUrl?: string
    price?: number
    ticketsAvailable?: boolean
  }
  onRsvp?: (eventId: string, status: "going" | "interested" | "none") => void
  initialRsvpStatus?: "going" | "interested" | "none"
  showActions?: boolean
  linkToEvent?: boolean
  compact?: boolean
  isAdmin?: boolean
}

export function CalendarEvent({
  event,
  onRsvp,
  initialRsvpStatus = "none",
  showActions = false,
  linkToEvent = true,
  compact = false,
  isAdmin = false,
}: CalendarEventProps) {
  const [rsvpStatus, setRsvpStatus] = useState(initialRsvpStatus)
  const router = useRouter()

  // Ensure start and end are valid Date objects
  const startDate = event.start instanceof Date && !isNaN(event.start.getTime()) ? event.start : new Date()

  const endDate =
    event.end instanceof Date && !isNaN(event.end.getTime())
      ? event.end
      : new Date(startDate.getTime() + 60 * 60 * 1000) // Default to 1 hour after start

  const formatTime = (date: Date) => {
    try {
      return format(date, "h:mm a")
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid time"
    }
  }

  const getDuration = (start: Date, end: Date) => {
    try {
      if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
        return ""
      }
      const durationMs = end.getTime() - start.getTime()
      const hours = Math.floor(durationMs / (1000 * 60 * 60))
      const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

      return `${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}m` : ""}`
    } catch (error) {
      console.error("Error calculating duration:", error)
      return ""
    }
  }

  const handleRsvp = (status: "going" | "interested" | "none") => {
    const newStatus = status === rsvpStatus ? "none" : status
    setRsvpStatus(newStatus)

    if (onRsvp) {
      onRsvp(event.id, newStatus)
    }
  }

  const getEventIcon = () => {
    switch (event.type) {
      case "shift":
        return <Briefcase className="h-6 w-6" />
      case "event":
        return <Calendar className="h-6 w-6" />
      case "task":
        return <Check className="h-6 w-6" />
      default:
        return <Calendar className="h-6 w-6" />
    }
  }

  const getEventIconBackground = () => {
    switch (event.type) {
      case "shift":
        return "bg-gray-100 text-gray-500"
      case "event":
        return "bg-gray-100 text-gray-500"
      case "task":
        return "bg-gray-100 text-gray-500"
      default:
        return "bg-gray-100 text-gray-500"
    }
  }

  const getEventLink = () => {
    switch (event.type) {
      case "shift":
        return `/shifts/${event.id}`
      case "event":
        return `/events/${event.id}`
      case "task":
        return `/tasks/${event.id}`
      default:
        return `#`
    }
  }

  const getEventColor = () => {
    if (event.colorClass) return event.colorClass
    return "border-gray-300 bg-gray-50"
  }

  // Determine if tickets are available
  const hasTickets = event.ticketsAvailable !== false && event.price !== undefined && event.price > 0

  if (compact) {
    return (
      <div className={`p-2 rounded-md border-l-4 ${getEventColor()} mb-2`}>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className={`rounded-full p-1.5 ${getEventIconBackground()}`}>{getEventIcon()}</div>
            <div>
              <h3 className="font-medium text-sm">
                {linkToEvent ? (
                  <Link href={getEventLink()} className="hover:underline">
                    {event.name}
                  </Link>
                ) : (
                  event.name
                )}
              </h3>
              <div className="text-xs text-muted-foreground">
                {formatTime(startDate)} - {formatTime(endDate)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {hasTickets && (
              <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">
                ${event.price?.toFixed(2)}
              </Badge>
            )}
            <Badge variant="outline" className="capitalize text-xs">
              {event.type}
            </Badge>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className={cn("border shadow-sm overflow-hidden", event.colorClass ? `border-l-4 ${event.colorClass}` : "")}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4 mb-4">
          <div className={`rounded-full p-3 ${getEventIconBackground()} self-start`}>{getEventIcon()}</div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">
                  {linkToEvent ? (
                    <Link href={getEventLink()} className="hover:underline">
                      {event.name}
                    </Link>
                  ) : (
                    event.name
                  )}
                </h3>
                {event.projectName && (
                  <Link href="#" className="text-sm text-muted-foreground hover:underline">
                    {event.projectName}
                  </Link>
                )}
                {event.groupName && !event.projectName && (
                  <Link href="#" className="text-sm text-muted-foreground hover:underline">
                    {event.groupName}
                  </Link>
                )}
              </div>
              <div className="flex items-center gap-2">
                {hasTickets && (
                  <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                    ${event.price?.toFixed(2)}
                  </Badge>
                )}
                <Badge variant="outline" className="capitalize">
                  {event.type}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 text-sm mt-3">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{format(startDate, "EEEE, MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  {formatTime(startDate)} - {formatTime(endDate)} ({getDuration(startDate, endDate)})
                </span>
              </div>
              {event.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
              )}
              {event.groupName && event.projectName && (
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{event.groupName}</span>
                </div>
              )}
            </div>

            {/* Ticket Button */}
            {hasTickets && (
              <div className="mt-4">
                <Button
                  className="w-full py-2 text-base font-medium bg-green-600 hover:bg-green-700 text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/events/${event.id}/tickets`)
                  }}
                >
                  <Ticket className="h-4 w-4 mr-2" />
                  Buy Tickets
                </Button>
              </div>
            )}

            {/* Admin Controls */}
            {isAdmin && (
              <div className="mt-4 p-3 border rounded-md bg-gray-50">
                <h4 className="font-medium mb-2">Admin Controls</h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/events/${event.id}/edit`)
                    }}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Event
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/events/${event.id}/attendees`)
                    }}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage Attendees
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/events/${event.id}/tickets`)
                    }}
                  >
                    <Ticket className="h-4 w-4 mr-2" />
                    Manage Tickets
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (window.confirm("Are you sure you want to cancel this event?")) {
                        console.log("Event cancelled:", event.id)
                      }
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel Event
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {showActions && event.type === "event" && (
        <CardFooter className="p-4 pt-0 flex justify-between gap-2 border-t mt-2">
          <Button
            size="sm"
            variant={rsvpStatus === "interested" ? "default" : "outline"}
            className={rsvpStatus === "interested" ? "bg-primary" : ""}
            onClick={() => handleRsvp("interested")}
          >
            {rsvpStatus === "interested" && <Check className="h-4 w-4 mr-1" />}
            Interested
          </Button>
          <Button
            size="sm"
            variant={rsvpStatus === "going" ? "default" : "outline"}
            className={rsvpStatus === "going" ? "bg-primary" : ""}
            onClick={() => handleRsvp("going")}
          >
            {rsvpStatus === "going" && <Check className="h-4 w-4 mr-1" />}
            Going
          </Button>
          {hasTickets ? (
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/events/${event.id}/tickets`)
              }}
            >
              <Ticket className="h-4 w-4 mr-1" />
              Tickets
            </Button>
          ) : (
            <Button size="sm" variant="default" onClick={() => handleRsvp("going")}>
              RSVP
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
