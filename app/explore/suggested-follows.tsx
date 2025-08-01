import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { TypeBadge } from "@/components/type-badge"
import { TypeIcon } from "@/components/type-icon"
import { users } from "@/lib/mock-data"
import Link from "next/link"

export function SuggestedFollows() {
  // Get a subset of users to suggest
  const suggestedUsers = users.slice(0, 3)

  return (
    <Card className="mt-6 border shadow-sm">
      <CardHeader className="bg-white">
        <CardTitle className="text-lg flex items-center gap-2">
          <TypeIcon type="person" size={18} />
          Who to follow
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {suggestedUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 border-l-4 border-gray-200"
            >
              <div className="flex items-center gap-3">
                <Avatar className="border-2 border-gray-200">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <Link href={`/profile/${user.username}`} className="font-medium hover:underline">
                      {user.name}
                    </Link>
                    <TypeBadge type="person" className="scale-75" showIcon={false} />
                  </div>
                  <p className="text-sm text-muted-foreground">@{user.username}</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="border-gray-300 hover:bg-gray-50">
                Follow
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
