"use client"
import { ChapterSwitcher } from "@/components/chapter-switcher"
import { Plus } from "lucide-react"
import { groups } from "@/lib/mock-data"
import Link from "next/link"
import Image from "next/image"

export default function GroupsPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-2">
      <div className="flex justify-center mb-4">
        <ChapterSwitcher />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 flex justify-center">
          <div className="border-b-2 border-primary px-4 py-2">
            <span className="text-primary font-medium">Groups</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-3 bg-gray-100 rounded-full p-2 pl-4 mb-6">
          <div className="flex-1">
            <input type="text" placeholder="Search group name" className="bg-transparent w-full focus:outline-none" />
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gray-100 rounded-full p-3">
            <Plus className="h-5 w-5" />
          </div>
          <span className="text-lg font-medium">Create a group</span>
        </div>

        <div className="space-y-4">
          {groups.map((group) => (
            <Link href={`/groups/${group.id}`} key={group.id} className="flex items-center gap-4 py-2">
              <div className="h-12 w-12 rounded-md overflow-hidden">
                <Image
                  src={group.avatar || "/placeholder.svg"}
                  alt={group.name}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{group.name}</h3>
                <p className="text-sm text-gray-500">Boulder's Venue on the Creek</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
