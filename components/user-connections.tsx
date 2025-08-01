import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/types"
import Link from "next/link"

interface UserConnectionsProps {
  connections: User[]
  title?: string
  maxDisplay?: number
  showViewAll?: boolean
}

export function UserConnections({
  connections,
  title = "Connections",
  maxDisplay = 6,
  showViewAll = true,
}: UserConnectionsProps) {
  const displayConnections = connections.slice(0, maxDisplay)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {displayConnections.map((connection) => (
            <Link
              href={`/profile/${connection.username}`}
              key={connection.id}
              className="flex flex-col items-center text-center"
            >
              <Avatar className="h-12 w-12 mb-1">
                <AvatarImage src={connection.avatar || "/placeholder.svg"} alt={connection.name} />
                <AvatarFallback>{connection.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium truncate w-full">{connection.name}</span>
            </Link>
          ))}
        </div>

        {showViewAll && connections.length > maxDisplay && (
          <Button variant="ghost" size="sm" className="w-full mt-3">
            View all {connections.length} connections
          </Button>
        )}

        {connections.length === 0 && (
          <p className="text-center text-muted-foreground py-4 text-sm">No connections yet</p>
        )}
      </CardContent>
    </Card>
  )
}
