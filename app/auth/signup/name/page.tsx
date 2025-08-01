"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function NamePage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const router = useRouter()

  const handleNext = () => {
    if (firstName && lastName) {
      router.push("/auth/signup/birthday")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="p-4">
        <Link href="/auth/signup">
          <ChevronLeft className="h-6 w-6" />
        </Link>
      </div>
      <div className="flex-1 flex flex-col p-6">
        <h1 className="text-2xl font-bold mb-2">What's your name?</h1>
        <p className="text-gray-600 mb-6">Enter the name you use in real life.</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Input
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="h-14 px-4 rounded-lg border-gray-300"
          />
          <Input
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="h-14 px-4 rounded-lg border-gray-300"
          />
        </div>

        <div className="mt-auto">
          <Button onClick={handleNext} className="w-full h-14 text-base font-medium" disabled={!firstName || !lastName}>
            Next
          </Button>
        </div>
      </div>

      <div className="p-6 text-center">
        <Link href="/auth/login" className="text-primary hover:underline">
          I already have an account
        </Link>
      </div>
    </div>
  )
}
