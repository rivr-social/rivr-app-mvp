"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { users, chapters, groups } from "@/lib/mock-data"
import { PeopleModule } from "@/components/people-module"
import { SearchHeader } from "@/components/search-header"

export default function PeoplePage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.bio.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Assign relationship types for demo purposes
  const peopleWithRelationships = filteredUsers.map((user, index) => {
    // Assign relationship types in a pattern
    let relationshipType
    if (index % 4 === 0) relationshipType = "Following"
    else if (index % 4 === 1) relationshipType = "Followers"
    else if (index % 4 === 2) relationshipType = "Connections"
    else relationshipType = "Collaborators"

    return {
      ...user,
      relationshipType,
    }
  })

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleConnect = (userId: string) => {
    console.log(`Connect with user: ${userId}`)
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6">
      <SearchHeader
        title="People"
        subtitle="Connect with people in your community"
        onSearch={handleSearch}
        placeholder="Search people..."
      />

      <Card className="mt-6">
        <CardHeader className="px-6 pt-6 pb-0">
          <h2 className="text-2xl font-bold">People</h2>
          <p className="text-muted-foreground">Find and connect with people in your network</p>
        </CardHeader>
        <CardContent className="px-6 py-4">
          <PeopleModule
            people={peopleWithRelationships}
            chapters={chapters}
            groups={groups}
            initialViewMode="grid" // Always use grid view
            showTabs={true}
            showFilters={false}
            showSearch={false} // We're using the SearchHeader instead
            onConnect={handleConnect}
            emptyStateMessage={searchQuery ? `No people found matching "${searchQuery}"` : "No people found"}
          />
        </CardContent>
      </Card>
    </div>
  )
}
