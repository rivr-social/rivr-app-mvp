"use client"

import { useState } from "react"
import { chapters } from "@/lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Users, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { TopBar } from "@/components/top-bar"
import Image from "next/image"
import Link from "next/link"

export default function ChaptersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  // Filter chapters based on search query
  const filteredChapters = searchQuery
    ? chapters.filter(
        (chapter) =>
          chapter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chapter.location?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chapter.location?.state?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chapter.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : chapters

  // Sort chapters by member count (descending)
  const sortedChapters = [...filteredChapters].sort((a, b) => b.memberCount - a.memberCount)

  return (
    <>
      <TopBar />
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Chapters</h1>
            <p className="text-muted-foreground">Find and join chapters in your area</p>
          </div>
          <Button onClick={() => router.push("/chapters/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Chapter
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search chapters by name or location..."
            className="pl-9 pr-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedChapters.map((chapter) => (
            <Link href={`/chapters/${chapter.id}`} key={chapter.id} className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <div className="relative h-40 w-full">
                  <Image
                    src={chapter.image || "/placeholder.svg"}
                    alt={chapter.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-black/30 rounded-t-lg" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <h2 className="text-xl font-bold text-white">{chapter.name}</h2>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center mb-2">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      {chapter.location?.city}, {chapter.location?.state}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{chapter.memberCount} members</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {chapter.description || "No description available."}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredChapters.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-xl font-bold mb-2">No chapters found</h2>
            <p className="text-muted-foreground mb-6">Try adjusting your search or create a new chapter</p>
            <Button onClick={() => router.push("/chapters/create")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Chapter
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
