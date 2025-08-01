"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronLeft, Plus, Trash2, DollarSign, Send, Download, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { projects, users, groups } from "@/lib/mock-data"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function EventFinancialsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()

  // Find the event by ID
  const event = projects.find((p) => p.id === params.id && p.type === "event") || projects[0]

  // Get the organizing group
  const organizer = groups.find((g) => g.id === event.organizer)

  // Mock financial data
  const [financialData, setFinancialData] = useState({
    revenue: 1250.0,
    expenses: 500.0,
    profit: 750.0,
    payouts: 300.0,
    remaining: 450.0,
  })

  // Expenses state
  const [expenses, setExpenses] = useState([
    { id: "1", description: "Venue rental", amount: "300.00", recipient: "Jane Doe" },
    { id: "2", description: "Sound equipment", amount: "150.00", recipient: "Sound Tech Inc" },
    { id: "3", description: "Staff", amount: "50.00", recipient: "Alex Johnson" },
  ])

  // Payouts state
  const [payouts, setPayouts] = useState([
    { id: "1", recipient: "Jane Doe", description: "Event coordination", amount: "200.00", status: "sent" },
    { id: "2", recipient: "Sound Tech Inc", description: "Audio services", amount: "100.00", status: "pending" },
  ])

  // New payout state
  const [newPayout, setNewPayout] = useState({
    recipient: "",
    amount: "",
    description: "",
  })

  // New expense state
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    recipient: "",
  })

  // Dialog states
  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false)
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false)

  // User search states
  const [payoutUserOpen, setPayoutUserOpen] = useState(false)
  const [expenseUserOpen, setExpenseUserOpen] = useState(false)

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.recipient) {
      toast({
        title: "Invalid expense",
        description: "Please provide a valid description, amount, and recipient.",
        variant: "destructive",
      })
      return
    }

    const newId = (expenses.length + 1).toString()
    setExpenses([
      ...expenses,
      {
        id: newId,
        description: newExpense.description,
        amount: newExpense.amount,
        recipient: newExpense.recipient,
      },
    ])

    setNewExpense({
      description: "",
      amount: "",
      recipient: "",
    })

    setExpenseDialogOpen(false)

    toast({
      title: "Expense added",
      description: "The expense has been added successfully.",
    })
  }

  const handleExpenseChange = (id: string, field: string, value: string) => {
    setExpenses(expenses.map((expense) => (expense.id === id ? { ...expense, [field]: value } : expense)))
  }

  const handleRemoveExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  const handleNewPayoutChange = (field: string, value: string) => {
    setNewPayout({ ...newPayout, [field]: value })
  }

  const handleNewExpenseChange = (field: string, value: string) => {
    setNewExpense({ ...newExpense, [field]: value })
  }

  const handleAddPayout = () => {
    if (!newPayout.recipient || !newPayout.amount || Number.parseFloat(newPayout.amount) <= 0) {
      toast({
        title: "Invalid payout",
        description: "Please provide a valid recipient and amount.",
        variant: "destructive",
      })
      return
    }

    const newId = (payouts.length + 1).toString()
    setPayouts([
      ...payouts,
      {
        id: newId,
        recipient: newPayout.recipient,
        description: newPayout.description,
        amount: newPayout.amount,
        status: "pending",
      },
    ])

    setNewPayout({
      recipient: "",
      amount: "",
      description: "",
    })

    setPayoutDialogOpen(false)

    toast({
      title: "Payout added",
      description: "The payout has been added successfully.",
    })
  }

  const handleSendPayouts = () => {
    // Update pending payouts to sent
    setPayouts(
      payouts.map((payout) => ({
        ...payout,
        status: "sent",
      })),
    )

    toast({
      title: "Payouts sent",
      description: "All pending payouts have been sent successfully.",
    })
  }

  const handleSaveChanges = () => {
    toast({
      title: "Changes saved",
      description: "Financial information has been updated successfully.",
    })
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 pb-20">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" className="p-0" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Event Financials</h1>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-2">{event.name}</h2>
          <p className="text-muted-foreground mb-4">
            {new Date(event.timeframe.start).toLocaleDateString()} at{" "}
            {new Date(event.timeframe.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>

          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h3 className="text-lg font-medium mb-4">Financials</h3>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span>Revenue</span>
                <span className="font-medium">${financialData.revenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Expenses</span>
                <span className="font-medium">${financialData.expenses.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Profit</span>
                <span className="font-medium">${financialData.profit.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Payouts</span>
                <span className="font-medium">${financialData.payouts.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">Remaining</span>
                <span className="font-medium">${financialData.remaining.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between mb-4">
            <Button variant="outline" onClick={handleSaveChanges}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button onClick={handleSendPayouts}>
              <Send className="h-4 w-4 mr-2" />
              Send Payouts
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Expenses</h3>
          <Dialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>Record a new expense for this event.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="expense-description" className="text-sm font-medium">
                    Description:
                  </label>
                  <Input
                    id="expense-description"
                    value={newExpense.description}
                    onChange={(e) => handleNewExpenseChange("description", e.target.value)}
                    placeholder="What is this expense for?"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="expense-amount" className="text-sm font-medium">
                    Amount:
                  </label>
                  <div className="relative">
                    <DollarSign className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="expense-amount"
                      value={newExpense.amount}
                      onChange={(e) => handleNewExpenseChange("amount", e.target.value)}
                      type="number"
                      step="0.01"
                      min="0"
                      className="pl-8"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="expense-recipient" className="text-sm font-medium">
                    Paid to:
                  </label>
                  <Popover open={expenseUserOpen} onOpenChange={setExpenseUserOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={expenseUserOpen}
                        className="w-full justify-between"
                      >
                        {newExpense.recipient ? newExpense.recipient : "Select recipient..."}
                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Search users..." />
                        <CommandList>
                          <CommandEmpty>No user found.</CommandEmpty>
                          <CommandGroup>
                            {users.map((user) => (
                              <CommandItem
                                key={user.id}
                                value={user.name}
                                onSelect={(currentValue) => {
                                  handleNewExpenseChange("recipient", currentValue)
                                  setExpenseUserOpen(false)
                                }}
                                className="cursor-pointer"
                              >
                                <div className="flex items-center">
                                  <Avatar className="h-6 w-6 mr-2">
                                    <AvatarImage src={user.avatar || "/placeholder.svg?height=32&width=32"} />
                                    <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                                  </Avatar>
                                  {user.name}
                                </div>
                              </CommandItem>
                            ))}
                            <CommandItem
                              value="Other"
                              onSelect={() => {
                                handleNewExpenseChange("recipient", "Other")
                                setExpenseUserOpen(false)
                              }}
                              className="cursor-pointer"
                            >
                              <div className="flex items-center">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarFallback>OT</AvatarFallback>
                                </Avatar>
                                Other (non-user)
                              </div>
                            </CommandItem>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setExpenseDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddExpense}>Add</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {expenses.length > 0 ? (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div key={expense.id} className="border rounded-md p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="font-medium">{expense.description}</div>
                    <div className="ml-2 text-sm text-muted-foreground">to {expense.recipient}</div>
                  </div>
                  <div className="font-medium">${Number(expense.amount).toFixed(2)}</div>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 h-8 px-2"
                    onClick={() => handleRemoveExpense(expense.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
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
          <Dialog open={payoutDialogOpen} onOpenChange={setPayoutDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Payout
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Payout</DialogTitle>
                <DialogDescription>Create a new payout for event contributors.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="recipient" className="text-sm font-medium">
                    Who:
                  </label>
                  <Popover open={payoutUserOpen} onOpenChange={setPayoutUserOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={payoutUserOpen}
                        className="w-full justify-between"
                      >
                        {newPayout.recipient ? newPayout.recipient : "Select recipient..."}
                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Search users..." />
                        <CommandList>
                          <CommandEmpty>No user found.</CommandEmpty>
                          <CommandGroup>
                            {users.map((user) => (
                              <CommandItem
                                key={user.id}
                                value={user.name}
                                onSelect={(currentValue) => {
                                  handleNewPayoutChange("recipient", currentValue)
                                  setPayoutUserOpen(false)
                                }}
                                className="cursor-pointer"
                              >
                                <div className="flex items-center">
                                  <Avatar className="h-6 w-6 mr-2">
                                    <AvatarImage src={user.avatar || "/placeholder.svg?height=32&width=32"} />
                                    <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                                  </Avatar>
                                  {user.name}
                                </div>
                              </CommandItem>
                            ))}
                            <CommandItem
                              value="Other"
                              onSelect={() => {
                                handleNewPayoutChange("recipient", "Other")
                                setPayoutUserOpen(false)
                              }}
                              className="cursor-pointer"
                            >
                              <div className="flex items-center">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarFallback>OT</AvatarFallback>
                                </Avatar>
                                Other (non-user)
                              </div>
                            </CommandItem>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <label htmlFor="amount" className="text-sm font-medium">
                    Amount:
                  </label>
                  <div className="relative">
                    <DollarSign className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="amount"
                      value={newPayout.amount}
                      onChange={(e) => handleNewPayoutChange("amount", e.target.value)}
                      type="number"
                      step="0.01"
                      min="0"
                      className="pl-8"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description:
                  </label>
                  <Textarea
                    id="description"
                    value={newPayout.description}
                    onChange={(e) => handleNewPayoutChange("description", e.target.value)}
                    placeholder="What is this payment for?"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPayoutDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPayout}>Add</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Payout can be sent 3 days after the event. All refunds must happen within this time before a payout can be
          sent.
        </p>

        {payouts.length > 0 ? (
          <div className="space-y-4">
            {payouts.map((payout) => (
              <div key={payout.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt={payout.recipient} />
                      <AvatarFallback>{payout.recipient.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{payout.recipient}</h4>
                      <p className="text-sm text-muted-foreground">{payout.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">${Number.parseFloat(payout.amount).toFixed(2)}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        payout.status === "sent" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {payout.status === "sent" ? "Sent" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">No payouts yet</p>
        )}
      </div>
    </div>
  )
}
