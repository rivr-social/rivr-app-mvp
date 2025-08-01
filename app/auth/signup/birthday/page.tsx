"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, X } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sheet, SheetContent } from "@/components/ui/sheet"

export default function BirthdayPage() {
  const [showExplanation, setShowExplanation] = useState(false)
  const router = useRouter()

  const handleNext = () => {
    router.push("/auth/signup/phone")
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="p-4">
        <Link href="/auth/signup/name">
          <ChevronLeft className="h-6 w-6" />
        </Link>
      </div>
      <div className="flex-1 flex flex-col p-6">
        <h1 className="text-2xl font-bold mb-2">What's your birthday?</h1>
        <p className="text-gray-600 mb-1">
          Choose your date of birth. You can always make this private later.{" "}
          <button className="text-primary hover:underline" onClick={() => setShowExplanation(true)}>
            Why do I need to provide my birthday?
          </button>
        </p>

        <div className="my-6">
          <div className="border border-gray-300 rounded-lg p-4 flex items-center">
            <span className="text-gray-500">Birthday (0 years old)</span>
            <span className="ml-auto">April 28, 2025</span>
          </div>
        </div>

        <div className="mt-auto">
          <Button onClick={handleNext} className="w-full h-14 text-base font-medium">
            Next
          </Button>
        </div>
      </div>

      <div className="p-6 text-center">
        <Link href="/auth/login" className="text-primary hover:underline">
          I already have an account
        </Link>
      </div>

      <Sheet open={showExplanation} onOpenChange={setShowExplanation}>
        <SheetContent side="bottom" className="rounded-t-xl">
          <div className="flex items-center justify-between mb-4">
            <X className="h-6 w-6" onClick={() => setShowExplanation(false)} />
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto"></div>
          </div>
          <h2 className="text-xl font-bold mb-4">Birthdays</h2>
          <p className="mb-4">
            Providing your birthday improves the features and helps to keep the One Local community safe. You can find
            your birthday in your personal information account settings.{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Learn more about how we use your info in our Privacy Policy.
            </Link>
          </p>
        </SheetContent>
      </Sheet>
    </div>
  )
}
