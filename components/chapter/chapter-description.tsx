import type { Chapter } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"

interface ChapterDescriptionProps {
  chapter: Chapter
}

export function ChapterDescription({ chapter }: ChapterDescriptionProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-2">About</h3>
        <div className="space-y-4">
          <p className="text-muted-foreground">{chapter.description || "No description available."}</p>

          {chapter.mission && (
            <div>
              <h4 className="font-medium">Mission</h4>
              <p className="text-muted-foreground">{chapter.mission}</p>
            </div>
          )}

          {chapter.vision && (
            <div>
              <h4 className="font-medium">Vision</h4>
              <p className="text-muted-foreground">{chapter.vision}</p>
            </div>
          )}

          {chapter.foundedDate && (
            <div>
              <h4 className="font-medium">Founded</h4>
              <p className="text-muted-foreground">{new Date(chapter.foundedDate).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
