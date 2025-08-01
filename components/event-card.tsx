"use client"
import { Calendar, MapPin } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface EventCardProps {
  id: string
  title: string
  description?: string
  date: Date | string
  location: string
  imageUrl: string
  groupName?: string
  groupId?: string
  isAdmin?: boolean
}

const EventCard = ({
  id,
  title,
  description,
  date,
  location,
  imageUrl,
  groupName,
  groupId,
  isAdmin,
}: EventCardProps) => {
  const router = useRouter()

  // Format date for display
  let formattedDate = "Date TBD"
  let formattedTime = "Time TBD"
  let shortDate = ""
  let dayOfMonth = ""
  let month = ""

  try {
    if (date) {
      const dateObj = typeof date === "string" ? new Date(date) : date

      if (dateObj && !isNaN(dateObj.getTime())) {
        const day = format(dateObj, "EEE")
        month = format(dateObj, "MMM")
        dayOfMonth = format(dateObj, "d")

        formattedDate = `${day}, ${format(dateObj, "MMM d")}`
        formattedTime = format(dateObj, "h:mm a")
        shortDate = format(dateObj, "MMM d")
      }
    }
  } catch (error) {
    console.error("Error formatting date:", error)
  }

  const handleCardClick = () => {
    router.push(`/events/${id}`)
  }

  // Truncate title if too long
  const truncatedTitle = title.length > 30 ? `${title.substring(0, 30)}...` : title

  return (
    <div
      className="rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img src={imageUrl || "/placeholder.svg"} alt={title} className="w-full h-48 object-cover" />
        <div className="absolute top-2 left-2 bg-white rounded-md px-2 py-1 text-xs font-medium flex items-center shadow-sm">
          {month} {dayOfMonth}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{truncatedTitle}</h3>

        <div className="flex items-center text-sm text-gray-600 mb-2">
          <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>
            {formattedDate} • {formattedTime}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate">{location}</span>
        </div>

        {groupName && (
          <div className="text-sm font-medium">
            {groupId ? (
              <Link href={`/groups/${groupId}`} className="hover:underline" onClick={(e) => e.stopPropagation()}>
                {groupName}
              </Link>
            ) : (
              <span>{groupName}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export { EventCard }
