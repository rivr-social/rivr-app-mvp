"use client"

import { useState, useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { jobShifts, projects, groups } from "@/lib/mock-data"
import { CalendarEvent } from "@/components/calendar-event"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Filter, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  getDay,
  isToday,
  isSameMonth,
} from "date-fns"
import { useRouter } from "next/navigation"
import { Calendar, Briefcase, Check } from "lucide-react"

export default function CalendarPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [view, setView] = useState("week")
  const [filters, setFilters] = useState({
    events: true,
    shifts: true,
    tasks: true,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  // Get all events for the current user (in a real app, this would be filtered by user)
  const userShifts = jobShifts.filter((shift) => shift.assignedUsers.includes("u1"))

  // Create calendar items from shifts
  const shiftEvents = userShifts.map((shift) => {
    const project = projects.find((p) => p.id === shift.project)
    const group = project ? groups.find((g) => g.id === project.organizer) : null

    // Make sure timeframe exists before accessing its properties
    const timeframeStart = shift.timeframe?.start || new Date().toISOString()
    const timeframeEnd = shift.timeframe?.end || new Date().toISOString()

    return {
      id: shift.id,
      name: shift.name,
      projectName: project?.name,
      groupName: group?.name,
      start: new Date(timeframeStart),
      end: new Date(timeframeEnd),
      location: project?.location?.address,
      type: "shift",
      color: "bg-blue-500",
      colorClass: "border-blue-500 bg-blue-50",
    }
  })

  // Get events the user is attending
  const userEvents = projects
    .filter((p) => p.type === "event")
    .map((event) => {
      // Handle both timeframe.start and startDate formats
      const startDate = event.timeframe?.start || event.startDate || new Date().toISOString()
      const endDate = event.timeframe?.end || event.endDate || new Date().toISOString()

      if (!startDate) return null // Skip events without timeframe

      const group = groups.find((g) => g.id === event.organizer)

      return {
        id: event.id,
        name: event.name || event.title,
        groupName: group?.name,
        start: new Date(startDate),
        end: new Date(endDate),
        location: event.location?.address || event.location,
        type: "event",
        color: "bg-green-500",
        colorClass: "border-green-500 bg-green-50",
      }
    })
    .filter(Boolean)

  // Add some mock tasks
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const mockTasks = [
    {
      id: "task1",
      name: "Prepare presentation",
      start: new Date(today.setHours(10, 0, 0, 0)),
      end: new Date(today.setHours(12, 0, 0, 0)),
      type: "task",
      color: "bg-purple-500",
      colorClass: "border-purple-500 bg-purple-50",
    },
    {
      id: "task2",
      name: "Team meeting",
      start: new Date(tomorrow.setHours(14, 0, 0, 0)),
      end: new Date(tomorrow.setHours(15, 30, 0, 0)),
      type: "task",
      color: "bg-purple-500",
      colorClass: "border-purple-500 bg-purple-50",
    },
  ]

  // Combine all calendar items
  const allCalendarItems = useMemo(() => {
    let items = [
      ...(filters.events ? userEvents : []),
      ...(filters.shifts ? shiftEvents : []),
      ...(filters.tasks ? mockTasks : []),
    ]

    // Ensure all dates are valid
    items = items.filter((item) => {
      try {
        return (
          item.start instanceof Date &&
          !isNaN(item.start.getTime()) &&
          item.end instanceof Date &&
          !isNaN(item.end.getTime())
        )
      } catch (error) {
        console.error("Invalid date in calendar item:", item, error)
        return false
      }
    })

    // Apply search filter if there's a query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.projectName?.toLowerCase().includes(query) ||
          item.groupName?.toLowerCase().includes(query) ||
          item.location?.toLowerCase().includes(query),
      )
    }

    return items
  }, [filters.events, filters.shifts, filters.tasks, searchQuery, userEvents, shiftEvents])

  // Filter events for the selected date if in day view
  const selectedDateEvents = useMemo(() => {
    if (view === "day") {
      return allCalendarItems.filter((event) => isSameDay(event.start, date))
    }
    return []
  }, [view, date, allCalendarItems])

  // Filter upcoming events (next 7 days) if in upcoming view
  const now = new Date()
  const oneWeekLater = new Date(now)
  oneWeekLater.setDate(now.getDate() + 7)

  const upcomingEvents = useMemo(() => {
    if (view === "upcoming") {
      return allCalendarItems
        .filter((event) => event.start >= now && event.start <= oneWeekLater)
        .sort((a, b) => a.start.getTime() - b.start.getTime())
    }
    return []
  }, [view, allCalendarItems])

  // Get events for the week view
  const weekEvents = useMemo(() => {
    if (view === "week") {
      const weekStart = startOfWeek(date, { weekStartsOn: 0 }) // 0 = Sunday
      const weekEnd = endOfWeek(date, { weekStartsOn: 0 })

      return allCalendarItems.filter((event) => event.start >= weekStart && event.start <= weekEnd)
    }
    return []
  }, [view, date, allCalendarItems])

  // Generate days for the week view
  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(date, { weekStartsOn: 0 })
    const weekEnd = endOfWeek(date, { weekStartsOn: 0 })

    return eachDayOfInterval({ start: weekStart, end: weekEnd })
  }, [date])

  // Month view data
  const monthStart = useMemo(() => startOfMonth(date), [date])
  const monthEnd = useMemo(() => endOfMonth(date), [date])
  const monthDays = useMemo(() => {
    // Get all days in the month
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

    // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const startDay = getDay(monthStart)

    // Get days from previous month to fill the first week
    const prevMonthDays =
      startDay > 0
        ? eachDayOfInterval({
            start: new Date(monthStart.getFullYear(), monthStart.getMonth(), -startDay + 1),
            end: new Date(monthStart.getFullYear(), monthStart.getMonth(), 0),
          })
        : []

    // Get days from next month to fill the last week
    const endDay = getDay(monthEnd)
    const nextMonthDays =
      endDay < 6
        ? eachDayOfInterval({
            start: new Date(monthEnd.getFullYear(), monthEnd.getMonth() + 1, 1),
            end: new Date(monthEnd.getFullYear(), monthEnd.getMonth() + 1, 6 - endDay),
          })
        : []

    return [...prevMonthDays, ...daysInMonth, ...nextMonthDays]
  }, [monthStart, monthEnd])

  // Group month days into weeks
  const monthWeeks = useMemo(() => {
    const weeks = []
    for (let i = 0; i < monthDays.length; i += 7) {
      weeks.push(monthDays.slice(i, i + 7))
    }
    return weeks
  }, [monthDays])

  // Get events for the month view
  const monthEvents = useMemo(() => {
    if (view === "month") {
      const monthViewStart = monthDays[0]
      const monthViewEnd = monthDays[monthDays.length - 1]

      return allCalendarItems.filter((event) => event.start >= monthViewStart && event.start <= monthViewEnd)
    }
    return []
  }, [view, monthDays, allCalendarItems])

  // Navigation functions
  const navigateToToday = () => {
    setDate(new Date())
  }

  const navigateDate = (direction: "prev" | "next") => {
    if (view === "day") {
      const newDate = new Date(date)
      newDate.setDate(newDate.getDate() + (direction === "prev" ? -1 : 1))
      setDate(newDate)
    } else if (view === "week") {
      setDate(direction === "prev" ? subWeeks(date, 1) : addWeeks(date, 1))
    } else if (view === "month") {
      setDate(direction === "prev" ? subMonths(date, 1) : addMonths(date, 1))
    }
  }

  // Toggle filters
  const toggleFilter = (filterName: keyof typeof filters) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }))
  }

  // Handle creating a new event
  const handleCreateEvent = () => {
    router.push("/create?type=event")
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Calendar</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCreateEvent}>
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Show on calendar</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="filter-events"
                        checked={filters.events}
                        onCheckedChange={() => toggleFilter("events")}
                      />
                      <Label htmlFor="filter-events" className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        Events
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="filter-shifts"
                        checked={filters.shifts}
                        onCheckedChange={() => toggleFilter("shifts")}
                      />
                      <Label htmlFor="filter-shifts" className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        Shifts
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="filter-tasks"
                        checked={filters.tasks}
                        onCheckedChange={() => toggleFilter("tasks")}
                      />
                      <Label htmlFor="filter-tasks" className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                        Tasks
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Search</h4>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search events..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Tabs defaultValue={view} className="w-full" onValueChange={setView} value={view}>
        <div className="flex justify-between items-center mb-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="upcoming">Agenda</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigateDate("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={navigateToToday}>
              Today
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigateDate("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          {view === "day" && (
            <h2 className="text-xl font-medium">
              {format(date, "EEEE, MMMM d, yyyy")}
              {isToday(date) && <Badge className="ml-2 bg-primary">Today</Badge>}
            </h2>
          )}

          {view === "week" && (
            <h2 className="text-xl font-medium">
              {format(weekDays[0], "MMMM d")} - {format(weekDays[6], "MMMM d, yyyy")}
              {weekDays.some((day) => isToday(day)) && <Badge className="ml-2 bg-primary">Current Week</Badge>}
            </h2>
          )}

          {view === "month" && <h2 className="text-xl font-medium">{format(date, "MMMM yyyy")}</h2>}

          {view === "upcoming" && <h2 className="text-xl font-medium">Upcoming Events</h2>}
        </div>

        <TabsContent value="day" className="mt-0">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              {Array.from({ length: 24 }).map((_, hour) => {
                const hourEvents = selectedDateEvents.filter((event) => {
                  const eventHour = event.start.getHours()
                  return eventHour === hour
                })

                return (
                  <div key={hour} className="flex">
                    <div className="w-16 text-right pr-4 text-muted-foreground text-sm py-2">
                      {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
                    </div>
                    <div className="flex-1 min-h-[60px] border-t relative">
                      {hourEvents.length > 0 ? (
                        <div className="absolute top-1 left-0 right-0">
                          {hourEvents.map((event) => (
                            <div
                              key={`${event.type}-${event.id}`}
                              className={`mb-1 p-2 rounded-md border-l-4 ${event.colorClass}`}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`rounded-full p-1 ${
                                      event.type === "event"
                                        ? "bg-green-100 text-green-500"
                                        : event.type === "shift"
                                          ? "bg-blue-100 text-blue-500"
                                          : "bg-purple-100 text-purple-500"
                                    }`}
                                  >
                                    {event.type === "event" ? (
                                      <Calendar className="h-4 w-4" />
                                    ) : event.type === "shift" ? (
                                      <Briefcase className="h-4 w-4" />
                                    ) : (
                                      <Check className="h-4 w-4" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-medium">{event.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
                                    </p>
                                    {event.projectName && <p className="text-xs">{event.projectName}</p>}
                                  </div>
                                </div>
                                <Badge variant="outline" className="capitalize">
                                  {event.type}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="week" className="mt-0">
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day, index) => (
              <div key={day.toISOString()} className="text-center p-2">
                <div className={`font-medium mb-1 ${isToday(day) ? "text-primary" : ""}`}>{format(day, "EEE")}</div>
                <div
                  className={`
                    rounded-full w-8 h-8 mx-auto flex items-center justify-center
                    ${isToday(day) ? "bg-primary text-white" : ""}
                  `}
                >
                  {format(day, "d")}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 mt-2">
            {weekDays.map((day) => {
              const dayEvents = weekEvents.filter((event) => isSameDay(event.start, day))
              const isCurrentDay = isToday(day)

              return (
                <div
                  key={day.toISOString()}
                  className={`border rounded-md min-h-[200px] ${isCurrentDay ? "bg-primary/5 border-primary" : ""}`}
                >
                  <div className="p-1 space-y-1">
                    {dayEvents.length > 0 ? (
                      dayEvents.map((event) => (
                        <div
                          key={`${event.type}-${event.id}`}
                          className={`p-1 text-xs rounded border-l-2 ${event.colorClass} truncate`}
                        >
                          <div className="flex items-center gap-1">
                            {event.type === "event" ? (
                              <Calendar className="h-3 w-3 text-green-500" />
                            ) : event.type === "shift" ? (
                              <Briefcase className="h-3 w-3 text-blue-500" />
                            ) : (
                              <Check className="h-3 w-3 text-purple-500" />
                            )}
                            <div className="truncate">
                              <div className="font-medium">
                                {event.start instanceof Date && !isNaN(event.start.getTime())
                                  ? format(event.start, "h:mm a")
                                  : "Invalid time"}
                              </div>
                              <div className="truncate">{event.name}</div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-xs text-muted-foreground py-2">No events</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="month" className="mt-0">
          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center p-2 font-medium">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {monthDays.map((day) => {
              const dayEvents = monthEvents.filter((event) => {
                try {
                  return isSameDay(event.start, day)
                } catch (error) {
                  console.error("Error comparing dates:", error)
                  return false
                }
              })
              const isCurrentDay = isToday(day)
              const isCurrentMonth = isSameMonth(day, date)

              return (
                <div
                  key={day.toISOString()}
                  className={`
                    border rounded-md min-h-[100px] 
                    ${isCurrentDay ? "bg-primary/5 border-primary" : ""}
                    ${!isCurrentMonth ? "bg-gray-50" : ""}
                  `}
                  onClick={() => {
                    setDate(day)
                    setView("day")
                  }}
                >
                  <div
                    className={`
                    text-right p-1 font-medium text-sm
                    ${isCurrentDay ? "text-primary" : ""}
                    ${!isCurrentMonth ? "text-muted-foreground" : ""}
                  `}
                  >
                    {format(day, "d")}
                  </div>
                  <div className="p-1">
                    {dayEvents.length > 0
                      ? dayEvents.slice(0, 3).map((event, idx) => (
                          <div
                            key={`${event.type}-${event.id}`}
                            className={`p-1 mb-1 text-xs rounded-sm border-l-2 ${event.colorClass} truncate`}
                          >
                            <div className="flex items-center gap-1">
                              {event.type === "event" ? (
                                <Calendar className="h-3 w-3 text-green-500" />
                              ) : event.type === "shift" ? (
                                <Briefcase className="h-3 w-3 text-blue-500" />
                              ) : (
                                <Check className="h-3 w-3 text-purple-500" />
                              )}
                              <div className="truncate">{event.name}</div>
                            </div>
                          </div>
                        ))
                      : null}

                    {dayEvents.length > 3 && (
                      <div className="text-xs text-center text-muted-foreground">+{dayEvents.length - 3} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="mt-0">
          <div className="space-y-4">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <CalendarEvent
                  key={`${event.type}-${event.id}`}
                  event={{
                    ...event,
                    ticketUrl: event.type === "event" ? "https://buytickets.at/theriverside/1550492" : undefined,
                  }}
                  showActions={event.type === "event"}
                  isAdmin={event.id === "p1" || event.id === "p3"} // Just for demo purposes
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No upcoming events in the next 7 days.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
