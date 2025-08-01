"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Minus, Plus, ArrowRight, Globe } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { projects, groups } from "@/lib/mock-data"
import Image from "next/image"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function EventTicketsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [rsvpStatus, setRsvpStatus] = useState<"going" | "interested" | "none">("none")

  // Find the event by ID
  const event = projects.find((p) => p.id === params.id && p.type === "event") || projects[0]

  // Get the organizing group
  const organizer = groups.find((g) => g.id === event.organizer)

  // Format dates
  const startDate = new Date(event.timeframe.start)
  const endDate = new Date(event.timeframe.end)

  // Mock ticket types
  const [ticketTypes, setTicketTypes] = useState([
    {
      id: "1",
      name: "General Admission",
      price: 20.0,
      description: "Standard entry ticket",
      available: 100,
      quantity: 0,
    },
    {
      id: "2",
      name: "VIP",
      price: 50.0,
      description: "Premium experience with special perks",
      available: 20,
      quantity: 0,
    },
    {
      id: "3",
      name: "Community",
      price: 0.0,
      description: "Free community ticket",
      available: 50,
      quantity: 0,
    },
  ])

  const handleQuantityChange = (id: string, change: number) => {
    setTicketTypes(
      ticketTypes.map((ticket) => {
        if (ticket.id === id) {
          const newQuantity = Math.max(0, Math.min(ticket.available, ticket.quantity + change))
          return { ...ticket, quantity: newQuantity }
        }
        return ticket
      }),
    )
  }

  const totalAmount = ticketTypes.reduce((sum, ticket) => sum + ticket.price * ticket.quantity, 0)
  const totalTickets = ticketTypes.reduce((sum, ticket) => sum + ticket.quantity, 0)

  const handleCheckout = () => {
    if (totalTickets === 0) {
      toast({
        title: "No tickets selected",
        description: "Please select at least one ticket to proceed.",
        variant: "destructive",
      })
      return
    }

    // Simulate checkout process
    toast({
      title: "Purchase successful!",
      description: `You have purchased ${totalTickets} ticket(s) for ${event.name}.`,
    })

    // Redirect to registered page
    router.push(`/events/${params.id}/registered`)
  }

  // Check if there are any free tickets
  const hasFreeTickets = ticketTypes.some((ticket) => ticket.price === 0)

  return (
    <div
      className="min-h-screen bg-gradient-to-br flex flex-col md:flex-row"
      style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e3a8a 100%)" }}
    >
      {/* Left side - Event image */}
      <div className="w-full md:w-2/5 p-6 flex items-center justify-center">
        <div className="relative w-full max-w-md aspect-square rounded-xl overflow-hidden shadow-2xl">
          <Image src={event.image || "/placeholder.svg"} alt={event.name} fill className="object-cover" priority />
        </div>
      </div>

      {/* Right side - Ticket selection */}
      <div className="w-full md:w-3/5 bg-white p-8 md:p-12 min-h-screen overflow-y-auto">
        <div className="max-w-2xl">
          <Button variant="ghost" className="mb-6 -ml-2 flex items-center" onClick={() => router.back()}>
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to event
          </Button>

          {/* Event header */}
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <div className="bg-gray-100 rounded-lg p-2 mr-4 text-center min-w-[60px]">
                <div className="text-xs uppercase font-medium text-gray-500">{format(startDate, "MMM")}</div>
                <div className="text-2xl font-bold">{format(startDate, "d")}</div>
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-2">{event.name}</h1>

            <div className="text-lg mb-6">
              {format(startDate, "EEEE, MMMM d")}
              <br />
              {format(startDate, "h:mm a")} - {format(endDate, "h:mm a")} {format(startDate, "z")}
            </div>

            <div className="flex items-center mb-2">
              <Globe className="h-5 w-5 mr-2 text-gray-500" />
              <span>Zoom</span>
            </div>
          </div>

          {/* Ticket selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Select Tickets</h2>
            <div className="space-y-4">
              {ticketTypes.map((ticket) => (
                <Card
                  key={ticket.id}
                  className={cn(
                    "overflow-hidden transition-all",
                    ticket.quantity > 0 ? "border-primary" : "border-gray-200",
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-lg">{ticket.name}</h4>
                        <p className="text-gray-500">{ticket.description}</p>
                        <p className="text-sm mt-1">{ticket.available} available</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">
                          {ticket.price === 0 ? "Free" : `$${ticket.price.toFixed(2)}`}
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => handleQuantityChange(ticket.id, -1)}
                            disabled={ticket.quantity === 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-6 text-center font-medium">{ticket.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => handleQuantityChange(ticket.id, 1)}
                            disabled={ticket.quantity >= ticket.available}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Checkout button */}
          <div className="sticky bottom-0 bg-white pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
                <div className="text-sm text-gray-500">
                  {totalTickets} {totalTickets === 1 ? "ticket" : "tickets"}
                </div>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={totalTickets === 0}
                className="px-8 py-6 text-lg font-medium bg-primary hover:bg-primary/90"
              >
                Register
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
