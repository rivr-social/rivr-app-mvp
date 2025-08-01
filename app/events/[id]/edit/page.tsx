"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  ImageIcon,
  Trash2,
  Plus,
  DollarSign,
  Check,
  ChevronsUpDown,
  UserIcon,
  Search,
  SendIcon,
  AlertCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { projects, groups, users } from "@/lib/mock-data"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

export default function EditEventPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [searchTerm, setSearchTerm] = useState("")
  const [confirmingPayout, setConfirmingPayout] = useState<string | null>(null)
  const [sendingPayout, setSendingPayout] = useState(false)

  // Find the event by ID
  const event = projects.find((p) => p.id === params.id && p.type === "event") || projects[0]

  // Get the organizing group
  const organizer = groups.find((g) => g.id === event.organizer)

  // Check if event has already happened
  const eventHasEnded = new Date(event.timeframe.end) < new Date()

  // Form state
  const [formData, setFormData] = useState({
    name: event.name,
    description: event.description,
    location: event.location.address || "",
    startDate: new Date(event.timeframe.start).toISOString().split("T")[0],
    startTime: new Date(event.timeframe.start).toISOString().split("T")[1].substring(0, 5),
    endDate: new Date(event.timeframe.end).toISOString().split("T")[0],
    endTime: new Date(event.timeframe.end).toISOString().split("T")[1].substring(0, 5),
    image: event.image || "",
    organizerId: event.organizer,
    isPublic: true,
    isOnline: false,
    requiresTicket: true,
    capacity: "100",
  })

  // Ticket types state
  const [ticketTypes, setTicketTypes] = useState([
    { id: "1", name: "General Admission", price: "20.00", available: "100", description: "Standard entry ticket" },
    { id: "2", name: "VIP", price: "50.00", available: "20", description: "Premium experience with special perks" },
    { id: "3", name: "eARTh pARTy", price: "0.00", available: "50", description: "Free community ticket" },
  ])

  // Expenses state
  const [expenses, setExpenses] = useState([
    {
      id: "1",
      description: "Venue rental",
      amount: "500.00",
      recipientId: "",
      recipientName: "Venue Owner",
      paid: false,
    },
    {
      id: "2",
      description: "Sound equipment",
      amount: "300.00",
      recipientId: "",
      recipientName: "Sound Tech Inc",
      paid: false,
    },
    { id: "3", description: "Staff", amount: "200.00", recipientId: "user2", recipientName: "Jane Doe", paid: true },
  ])

  // Payouts state
  const [payouts, setPayouts] = useState([
    {
      id: "1",
      description: "Event coordination",
      amount: "200.00",
      recipientId: "user2",
      recipientName: "Jane Doe",
      paid: false,
    },
    {
      id: "2",
      description: "Audio services",
      amount: "150.00",
      recipientId: "",
      recipientName: "Sound Tech Inc",
      paid: false,
    },
  ])

  // Dropdown open states
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({})

  // Dialog open state
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  // Financial summary
  const totalRevenue = ticketTypes.reduce(
    (sum, ticket) => sum + Number.parseFloat(ticket.price) * Number.parseInt(ticket.available),
    0,
  )
  const totalExpenses = expenses.reduce((sum, expense) => sum + Number.parseFloat(expense.amount), 0)
  const totalPayouts = payouts.reduce((sum, payout) => sum + Number.parseFloat(payout.amount), 0)
  const profit = totalRevenue - totalExpenses
  const remaining = profit - totalPayouts

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleAddTicketType = () => {
    const newId = (ticketTypes.length + 1).toString()
    setTicketTypes([
      ...ticketTypes,
      { id: newId, name: "New Ticket", price: "0.00", available: "50", description: "Ticket description" },
    ])
  }

  const handleTicketChange = (id: string, field: string, value: string) => {
    setTicketTypes(ticketTypes.map((ticket) => (ticket.id === id ? { ...ticket, [field]: value } : ticket)))
  }

  const handleRemoveTicketType = (id: string) => {
    setTicketTypes(ticketTypes.filter((ticket) => ticket.id !== id))
  }

  const handleAddExpense = () => {
    const newId = (expenses.length + 1).toString()
    setExpenses([
      ...expenses,
      {
        id: newId,
        description: "New expense",
        amount: "0.00",
        recipientId: "",
        recipientName: "",
        paid: false,
      },
    ])
  }

  const handleExpenseChange = (id: string, field: string, value: string) => {
    setExpenses(expenses.map((expense) => (expense.id === id ? { ...expense, [field]: value } : expense)))
  }

  const handleExpenseRecipientChange = (id: string, userId: string, userName: string) => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === id ? { ...expense, recipientId: userId, recipientName: userName } : expense,
      ),
    )
    toggleDropdown(`expense-${id}`, false)
  }

  const handleRemoveExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  const handleAddPayout = () => {
    const newId = (payouts.length + 1).toString()
    setPayouts([
      ...payouts,
      {
        id: newId,
        description: "New payout",
        amount: "0.00",
        recipientId: "",
        recipientName: "",
        paid: false,
      },
    ])
  }

  const handlePayoutChange = (id: string, field: string, value: string) => {
    setPayouts(payouts.map((payout) => (payout.id === id ? { ...payout, [field]: value } : payout)))
  }

  const handlePayoutRecipientChange = (id: string, userId: string, userName: string) => {
    setPayouts(
      payouts.map((payout) =>
        payout.id === id ? { ...payout, recipientId: userId, recipientName: userName } : payout,
      ),
    )
    toggleDropdown(`payout-${id}`, false)
  }

  const handleRemovePayout = (id: string) => {
    setPayouts(payouts.filter((payout) => payout.id !== id))
  }

  const toggleDropdown = (id: string, state?: boolean) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: state !== undefined ? state : !prev[id],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Event updated",
      description: "Your event has been updated successfully.",
    })

    setIsSubmitting(false)
    router.push(`/events/${params.id}`)
  }

  const handleSendPayout = async (id: string, type: "expense" | "payout") => {
    setConfirmingPayout(`${type}-${id}`)
    setConfirmDialogOpen(true)
  }

  const confirmSendPayout = async () => {
    if (!confirmingPayout) return

    setSendingPayout(true)

    // Parse the type and id from the confirmingPayout string
    const [type, id] = confirmingPayout.split("-")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (type === "expense") {
      setExpenses(expenses.map((expense) => (expense.id === id ? { ...expense, paid: true } : expense)))
    } else if (type === "payout") {
      setPayouts(payouts.map((payout) => (payout.id === id ? { ...payout, paid: true } : payout)))
    }

    toast({
      title: "Payout sent",
      description: `The payout has been sent successfully to ${
        type === "expense"
          ? expenses.find((e) => e.id === id)?.recipientName
          : payouts.find((p) => p.id === id)?.recipientName
      }.`,
    })

    setSendingPayout(false)
    setConfirmDialogOpen(false)
    setConfirmingPayout(null)
  }

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Filter users based on search term
  const filterUsers = (term: string) => {
    if (!term) return users
    return users.filter((user) => user.name.toLowerCase().includes(term.toLowerCase()))
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 pb-20">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" className="p-0" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Edit Event</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Event Name
                    </label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Description
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="organizerId" className="text-sm font-medium">
                      Organizer
                    </label>
                    <select
                      id="organizerId"
                      name="organizerId"
                      value={formData.organizerId}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      {groups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Date & Time</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <label htmlFor="startDate" className="text-sm">
                            Start Date
                          </label>
                        </div>
                        <Input
                          type="date"
                          id="startDate"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <label htmlFor="startTime" className="text-sm">
                            Start Time
                          </label>
                        </div>
                        <Input
                          type="time"
                          id="startTime"
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <label htmlFor="endDate" className="text-sm">
                            End Date
                          </label>
                        </div>
                        <Input
                          type="date"
                          id="endDate"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <label htmlFor="endTime" className="text-sm">
                            End Time
                          </label>
                        </div>
                        <Input
                          type="time"
                          id="endTime"
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <label htmlFor="location" className="text-sm font-medium">
                        Location
                      </label>
                    </div>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Enter address"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="image" className="text-sm font-medium">
                      Event Image
                    </label>
                    <div className="relative">
                      {formData.image && (
                        <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
                          <Image
                            src={formData.image || "/placeholder.svg"}
                            alt="Event cover"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Input
                          id="image"
                          name="image"
                          value={formData.image}
                          onChange={handleChange}
                          placeholder="Image URL"
                        />
                        <Button type="button" variant="outline" size="icon">
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tickets" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Ticket Types</h3>
                  <Button type="button" onClick={handleAddTicketType} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Ticket Type
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="requiresTicket"
                        checked={formData.requiresTicket}
                        onCheckedChange={(checked) => handleSwitchChange("requiresTicket", checked)}
                      />
                      <Label htmlFor="requiresTicket">Require tickets for entry</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="capacity">Max Capacity:</Label>
                      <Input
                        id="capacity"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        className="w-24"
                      />
                    </div>
                  </div>

                  {ticketTypes.map((ticket) => (
                    <div key={ticket.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="grid gap-2 flex-1">
                          <label htmlFor={`ticket-name-${ticket.id}`} className="text-sm font-medium">
                            Ticket Name
                          </label>
                          <Input
                            id={`ticket-name-${ticket.id}`}
                            value={ticket.name}
                            onChange={(e) => handleTicketChange(ticket.id, "name", e.target.value)}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleRemoveTicketType(ticket.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="grid gap-2">
                          <label htmlFor={`ticket-price-${ticket.id}`} className="text-sm font-medium">
                            Price ($)
                          </label>
                          <Input
                            id={`ticket-price-${ticket.id}`}
                            value={ticket.price}
                            onChange={(e) => handleTicketChange(ticket.id, "price", e.target.value)}
                            type="number"
                            step="0.01"
                            min="0"
                          />
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor={`ticket-available-${ticket.id}`} className="text-sm font-medium">
                            Available Quantity
                          </label>
                          <Input
                            id={`ticket-available-${ticket.id}`}
                            value={ticket.available}
                            onChange={(e) => handleTicketChange(ticket.id, "available", e.target.value)}
                            type="number"
                            min="0"
                          />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <label htmlFor={`ticket-description-${ticket.id}`} className="text-sm font-medium">
                          Description
                        </label>
                        <Input
                          id={`ticket-description-${ticket.id}`}
                          value={ticket.description}
                          onChange={(e) => handleTicketChange(ticket.id, "description", e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financials" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Financial Summary</h3>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between py-2 border-b">
                    <span>Revenue</span>
                    <span className="font-medium">${totalRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Expenses</span>
                    <span className="font-medium">${totalExpenses.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Profit</span>
                    <span className="font-medium">${profit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Payouts</span>
                    <span className="font-medium">${totalPayouts.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium">Remaining</span>
                    <span className="font-medium">${remaining.toFixed(2)}</span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Expenses</h3>
                    <Button type="button" onClick={handleAddExpense} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Expense
                    </Button>
                  </div>

                  {expenses.length > 0 ? (
                    <div className="space-y-4">
                      {expenses.map((expense) => (
                        <div key={expense.id} className="border rounded-md p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div className="grid gap-2 flex-1">
                              <div className="flex items-center justify-between">
                                <label htmlFor={`expense-desc-${expense.id}`} className="text-sm font-medium">
                                  Description
                                </label>
                                {expense.paid && (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    Paid
                                  </Badge>
                                )}
                              </div>
                              <Input
                                id={`expense-desc-${expense.id}`}
                                value={expense.description}
                                onChange={(e) => handleExpenseChange(expense.id, "description", e.target.value)}
                                placeholder="Description"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleRemoveExpense(expense.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid gap-4 mb-4">
                            <div className="grid gap-2">
                              <label htmlFor={`expense-recipient-${expense.id}`} className="text-sm font-medium">
                                Recipient
                              </label>
                              <div className="relative">
                                <DropdownMenu
                                  open={openDropdowns[`expense-${expense.id}`]}
                                  onOpenChange={(open) => toggleDropdown(`expense-${expense.id}`, open)}
                                >
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="w-full justify-between"
                                      id={`expense-recipient-${expense.id}`}
                                      disabled={expense.paid}
                                    >
                                      <div className="flex items-center">
                                        {expense.recipientId ? (
                                          <>
                                            <Avatar className="h-6 w-6 mr-2">
                                              <AvatarImage
                                                src={
                                                  users.find((u) => u.id === expense.recipientId)?.avatar ||
                                                  "/placeholder.svg" ||
                                                  "/placeholder.svg"
                                                }
                                                alt={expense.recipientName}
                                              />
                                              <AvatarFallback>{getInitials(expense.recipientName)}</AvatarFallback>
                                            </Avatar>
                                            <span>{expense.recipientName}</span>
                                          </>
                                        ) : expense.recipientName ? (
                                          <span>{expense.recipientName}</span>
                                        ) : (
                                          <span className="text-muted-foreground">Select recipient...</span>
                                        )}
                                      </div>
                                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="w-[300px] p-0" align="start">
                                    <div className="p-2">
                                      <div className="relative">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                          type="search"
                                          placeholder="Search users..."
                                          className="pl-8"
                                          value={searchTerm}
                                          onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                      </div>
                                    </div>
                                    <div className="max-h-[300px] overflow-auto">
                                      {filterUsers(searchTerm).length > 0 ? (
                                        filterUsers(searchTerm).map((user) => (
                                          <DropdownMenuItem
                                            key={user.id}
                                            className="flex items-center gap-2 p-2"
                                            onClick={() => handleExpenseRecipientChange(expense.id, user.id, user.name)}
                                          >
                                            <Avatar className="h-8 w-8">
                                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                            </Avatar>
                                            <span>{user.name}</span>
                                            {expense.recipientId === user.id && <Check className="ml-auto h-4 w-4" />}
                                          </DropdownMenuItem>
                                        ))
                                      ) : (
                                        <div className="text-center py-2 text-sm text-muted-foreground">
                                          No users found
                                        </div>
                                      )}
                                    </div>
                                    <Separator />
                                    <DropdownMenuItem
                                      className="p-2"
                                      onClick={() => {
                                        const customName = prompt("Enter recipient name:")
                                        if (customName) {
                                          handleExpenseRecipientChange(expense.id, "", customName)
                                        }
                                      }}
                                    >
                                      <UserIcon className="mr-2 h-4 w-4" />
                                      <span>Add custom recipient</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>

                          <div className="grid gap-2 mb-4">
                            <label htmlFor={`expense-amount-${expense.id}`} className="text-sm font-medium">
                              Amount ($)
                            </label>
                            <div className="relative">
                              <DollarSign className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                              <Input
                                id={`expense-amount-${expense.id}`}
                                value={expense.amount}
                                onChange={(e) => handleExpenseChange(expense.id, "amount", e.target.value)}
                                type="number"
                                step="0.01"
                                min="0"
                                className="pl-8"
                                disabled={expense.paid}
                              />
                            </div>
                          </div>

                          {!expense.paid && eventHasEnded && (
                            <Button
                              type="button"
                              className="w-full"
                              onClick={() => handleSendPayout(expense.id, "expense")}
                            >
                              <SendIcon className="h-4 w-4 mr-2" />
                              Send Payment
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">No expenses yet</p>
                  )}
                </div>

                <Separator className="my-6" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Payouts</h3>
                    <Button type="button" onClick={handleAddPayout} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Payout
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    Payout can be sent 3 days after the event. All refunds must happen within this time before a payout
                    can be sent.
                  </p>

                  {payouts.length > 0 ? (
                    <div className="space-y-4">
                      {payouts.map((payout) => (
                        <div key={payout.id} className="border rounded-md p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div className="grid gap-2 flex-1">
                              <div className="flex items-center justify-between">
                                <label htmlFor={`payout-desc-${payout.id}`} className="text-sm font-medium">
                                  Description
                                </label>
                                {payout.paid && (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    Paid
                                  </Badge>
                                )}
                              </div>
                              <Input
                                id={`payout-desc-${payout.id}`}
                                value={payout.description}
                                onChange={(e) => handlePayoutChange(payout.id, "description", e.target.value)}
                                placeholder="Description"
                                disabled={payout.paid}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleRemovePayout(payout.id)}
                              disabled={payout.paid}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid gap-4 mb-4">
                            <div className="grid gap-2">
                              <label htmlFor={`payout-recipient-${payout.id}`} className="text-sm font-medium">
                                Recipient
                              </label>
                              <div className="relative">
                                <DropdownMenu
                                  open={openDropdowns[`payout-${payout.id}`]}
                                  onOpenChange={(open) => toggleDropdown(`payout-${payout.id}`, open)}
                                >
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="w-full justify-between"
                                      id={`payout-recipient-${payout.id}`}
                                      disabled={payout.paid}
                                    >
                                      <div className="flex items-center">
                                        {payout.recipientId ? (
                                          <>
                                            <Avatar className="h-6 w-6 mr-2">
                                              <AvatarImage
                                                src={
                                                  users.find((u) => u.id === payout.recipientId)?.avatar ||
                                                  "/placeholder.svg" ||
                                                  "/placeholder.svg"
                                                }
                                                alt={payout.recipientName}
                                              />
                                              <AvatarFallback>{getInitials(payout.recipientName)}</AvatarFallback>
                                            </Avatar>
                                            <span>{payout.recipientName}</span>
                                          </>
                                        ) : payout.recipientName ? (
                                          <span>{payout.recipientName}</span>
                                        ) : (
                                          <span className="text-muted-foreground">Select recipient...</span>
                                        )}
                                      </div>
                                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="w-[300px] p-0" align="start">
                                    <div className="p-2">
                                      <div className="relative">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                          type="search"
                                          placeholder="Search users..."
                                          className="pl-8"
                                          value={searchTerm}
                                          onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                      </div>
                                    </div>
                                    <div className="max-h-[300px] overflow-auto">
                                      {filterUsers(searchTerm).length > 0 ? (
                                        filterUsers(searchTerm).map((user) => (
                                          <DropdownMenuItem
                                            key={user.id}
                                            className="flex items-center gap-2 p-2"
                                            onClick={() => handlePayoutRecipientChange(payout.id, user.id, user.name)}
                                          >
                                            <Avatar className="h-8 w-8">
                                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                            </Avatar>
                                            <span>{user.name}</span>
                                            {payout.recipientId === user.id && <Check className="ml-auto h-4 w-4" />}
                                          </DropdownMenuItem>
                                        ))
                                      ) : (
                                        <div className="text-center py-2 text-sm text-muted-foreground">
                                          No users found
                                        </div>
                                      )}
                                    </div>
                                    <Separator />
                                    <DropdownMenuItem
                                      className="p-2"
                                      onClick={() => {
                                        const customName = prompt("Enter recipient name:")
                                        if (customName) {
                                          handlePayoutRecipientChange(payout.id, "", customName)
                                        }
                                      }}
                                    >
                                      <UserIcon className="mr-2 h-4 w-4" />
                                      <span>Add custom recipient</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>

                          <div className="grid gap-2 mb-4">
                            <label htmlFor={`payout-amount-${payout.id}`} className="text-sm font-medium">
                              Amount ($)
                            </label>
                            <div className="relative">
                              <DollarSign className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                              <Input
                                id={`payout-amount-${payout.id}`}
                                value={payout.amount}
                                onChange={(e) => handlePayoutChange(payout.id, "amount", e.target.value)}
                                type="number"
                                step="0.01"
                                min="0"
                                className="pl-8"
                                disabled={payout.paid}
                              />
                            </div>
                          </div>

                          {!payout.paid && eventHasEnded && (
                            <Button
                              type="button"
                              className="w-full"
                              onClick={() => handleSendPayout(payout.id, "payout")}
                            >
                              <SendIcon className="h-4 w-4 mr-2" />
                              Send Payout
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">No payouts yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Public Event</h3>
                      <p className="text-sm text-muted-foreground">Make this event visible to everyone</p>
                    </div>
                    <Switch
                      checked={formData.isPublic}
                      onCheckedChange={(checked) => handleSwitchChange("isPublic", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Online Event</h3>
                      <p className="text-sm text-muted-foreground">This event will be held online</p>
                    </div>
                    <Switch
                      checked={formData.isOnline}
                      onCheckedChange={(checked) => handleSwitchChange("isOnline", checked)}
                    />
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">Danger Zone</h3>
                    <div className="space-y-4">
                      <Button type="button" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                        Cancel Event
                      </Button>
                      <Button type="button" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                        Delete Event
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Event"}
          </Button>
        </div>
      </form>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogDescription>
              Are you sure you want to send this payment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 py-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <p className="text-sm text-muted-foreground">Funds will be transferred immediately from your account.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)} disabled={sendingPayout}>
              Cancel
            </Button>
            <Button onClick={confirmSendPayout} disabled={sendingPayout}>
              {sendingPayout ? "Processing..." : "Confirm Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
