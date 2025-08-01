import type { Chapter, Project } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, ArrowRight } from "lucide-react"
import { EmptyState } from "@/components/empty-state"
import Image from "next/image"
import Link from "next/link"

interface ChapterProjectsProps {
  chapter: Chapter
  projects?: Project[]
}

export function ChapterProjects({ chapter, projects = [] }: ChapterProjectsProps) {
  if (!projects || projects.length === 0) {
    return (
      <EmptyState
        title="No Projects"
        description="This chapter doesn't have any projects yet."
        icon="folder"
        action={<Button>Create Project</Button>}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Projects</h3>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            {project.coverImage && (
              <div className="relative h-48 w-full">
                <Image
                  src={project.coverImage || "/placeholder.svg"}
                  alt={project.title}
                  className="object-cover"
                  fill
                />
              </div>
            )}
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {project.startDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(project.startDate).toLocaleDateString()}</span>
                  </div>
                )}
                {project.memberCount && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{project.memberCount} members</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/projects/${project.id}`} passHref>
                <Button variant="ghost" className="w-full justify-between">
                  View Project
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
