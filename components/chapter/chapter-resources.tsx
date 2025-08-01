import type { Chapter, Resource } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, LinkIcon, ExternalLink } from "lucide-react"
import { EmptyState } from "@/components/empty-state"
import Link from "next/link"

interface ChapterResourcesProps {
  chapter: Chapter
  resources?: Resource[]
}

export function ChapterResources({ chapter, resources = [] }: ChapterResourcesProps) {
  if (!resources || resources.length === 0) {
    return (
      <EmptyState
        title="No Resources"
        description="This chapter doesn't have any resources yet."
        icon="file-text"
        action={<Button>Add Resource</Button>}
      />
    )
  }

  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "document":
        return <FileText className="h-5 w-5" />
      case "link":
        return <LinkIcon className="h-5 w-5" />
      case "download":
        return <Download className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Resources</h3>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {resources.map((resource) => (
          <Card key={resource.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                {getResourceIcon(resource.type)}
                <CardTitle className="text-base">{resource.title}</CardTitle>
              </div>
              <CardDescription>{resource.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{resource.type}</Badge>
                {resource.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              {resource.type.toLowerCase() === "link" ? (
                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button variant="ghost" className="w-full justify-between">
                    Visit Link
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              ) : (
                <Link href={resource.url || "#"} passHref>
                  <Button variant="ghost" className="w-full justify-between">
                    {resource.type === "download" ? "Download" : "View"}
                    <Download className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
