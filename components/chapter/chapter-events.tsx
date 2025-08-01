import type { Chapter, Event } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users, ArrowRight } from "lucide-react"
import { EmptyState } from "@/components/empty-state"
import Image from "next/image"
import Link from "next/link"

interface ChapterEventsProps {
  chapter: Chapter
  events?: Event[]
}

export function ChapterEvents({ chapter, events = [] }: ChapterEventsProps) {
  if (!events || events.length === 0) {
    return (
      <EmptyState
        title="No Events"
        description="This chapter doesn't have any upcoming events."
        icon="calendar"
        action={<Button>Create Event</Button>}
      />
    )
  }

  const formatEventTime = (event: Event) => {
    if (!event.startTime) return "TBD"

    const startDate = new Date(event.startTime)
    const endDate = event.endTime ? new Date(event.endTime) : null

    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }

    const startTime = startDate.toLocaleTimeString(undefined, options)

    if (!endDate) return startTime

    const endTime = endDate.toLocaleTimeString(undefined, options)
    return `${startTime} - ${endTime}`
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Upcoming Events</h3>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden">
            {event.coverImage && (
              <div className="relative h-48 w-full">
                <Image src={event.coverImage || "/placeholder.svg"} alt={event.title} className="object-cover" fill />
              </div>
            )}
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
              <CardDescription>{event.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {event.startTime && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(event.startTime).toLocaleDateString()}</span>
                  </div>
                )}
                {event.startTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatEventTime(event)}</span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                )}
                {event.attendeeCount !== undefined && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{event.attendeeCount} attending</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {event.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/events/${event.id}`} passHref>
                <Button variant="ghost" className="w-full justify-between">
                  View Event
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
