"use client"

import { Button } from "@/components/ui/button"
import { Check, Calendar, Share2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { projects } from "@/lib/mock-data"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

export default function EventRegisteredPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()

  // Find the event by ID
  const event = projects.find((p) => p.id === params.id) || projects[0]

  // Format dates
  const startDate = new Date(event.timeframe.start)
  const endDate = new Date(event.timeframe.end)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <Check className="h-8 w-8 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold mb-2">You're registered!</h1>
          <p className="text-gray-600 mb-6">Your registration for {event.name} has been confirmed.</p>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold">{event.name}</h2>
            </div>

            <div className="flex items-center text-gray-600 mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{format(startDate, "EEEE, MMMM d, yyyy")}</span>
            </div>

            <div className="text-gray-600">
              <span>
                {format(startDate, "h:mm a")} - {format(endDate, "h:mm a")}
              </span>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                toast({ title: "Event added to calendar" })
              }}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Add to Calendar
            </Button>

            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                toast({ title: "Event link copied" })
              }}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          <div className="text-sm text-gray-500 mb-6">
            A confirmation email has been sent to your registered email address.
          </div>

          <Button className="w-full" onClick={() => router.push(`/events/${params.id}`)}>
            View Event Details
          </Button>
        </div>
      </div>
    </div>
  )
}
