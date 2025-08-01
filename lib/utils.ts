import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { chapters } from "@/lib/mock-data"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add the getChapterName function to utils.ts
export function getChapterName(chapterId: string) {
  const chapter = chapters.find((c) => c.id === chapterId)
  return chapter ? chapter.name : chapterId
}

// Add any other utility functions that might be shared across components
export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}
