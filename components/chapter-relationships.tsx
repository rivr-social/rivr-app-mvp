"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { chapters } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"

interface ChapterRelationshipsProps {
  chapterId: string
}

export function ChapterRelationships({ chapterId }: ChapterRelationshipsProps) {
  const [activeTab, setActiveTab] = useState("subchapters")

  // Get current chapter
  const currentChapter = chapters.find((c) => c.id === chapterId)

  if (!currentChapter) {
    return <div>Chapter not found</div>
  }

  // Get subchapters (chapters where this is the parent)
  const subchapters = chapters.filter((c) => c.parentChapterId === chapterId)

  // Get affiliated chapters
  const affiliatedChapters = currentChapter.affiliatedChapters
    ? chapters.filter((c) => currentChapter.affiliatedChapters?.includes(c.id))
    : []

  return (
    <div className="space-y-6">
      <Tabs defaultValue="subchapters" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="subchapters">Subchapters</TabsTrigger>
          <TabsTrigger value="affiliated">Affiliated Chapters</TabsTrigger>
        </TabsList>

        <TabsContent value="subchapters">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Subchapters</span>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Subchapter
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {subchapters.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subchapters.map((chapter) => (
                    <Link href={`/chapters/${chapter.id}`} key={chapter.id} className="block">
                      <Card className="overflow-hidden hover:shadow-md transition-shadow">
                        <div className="relative h-32 w-full">
                          <Image
                            src={chapter.image || "/placeholder.svg"}
                            alt={chapter.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-0 left-0 p-3">
                            <h3 className="text-lg font-semibold text-white">{chapter.name}</h3>
                            <div className="flex items-center">
                              <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-xs">
                                Subchapter
                              </Badge>
                              <span className="text-xs text-white/80 ml-2">{chapter.memberCount} members</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No subchapters yet</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Subchapter
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="affiliated">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Affiliated Chapters</span>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Affiliation
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {affiliatedChapters.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {affiliatedChapters.map((chapter) => (
                    <Link href={`/chapters/${chapter.id}`} key={chapter.id} className="block">
                      <Card className="overflow-hidden hover:shadow-md transition-shadow">
                        <div className="relative h-32 w-full">
                          <Image
                            src={chapter.image || "/placeholder.svg"}
                            alt={chapter.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-0 left-0 p-3">
                            <h3 className="text-lg font-semibold text-white">{chapter.name}</h3>
                            <div className="flex items-center">
                              <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-xs">
                                Affiliated
                              </Badge>
                              <span className="text-xs text-white/80 ml-2">{chapter.memberCount} members</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No affiliated chapters yet</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Affiliation
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
