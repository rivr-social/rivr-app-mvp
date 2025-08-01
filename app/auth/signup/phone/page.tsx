"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function PhonePage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const router = useRouter()

  const handleNext = () => {
    if (phoneNumber) {
      router.push("/auth/signup/email")
    }
  }

  const handleEmailSignup = () => {
    router.push("/auth/signup/email")
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="p-4">
        <Link href="/auth/signup/birthday">
          <ChevronLeft className="h-6 w-6" />
        </Link>
      </div>
      <div className="flex-1 flex flex-col p-6">
        <h1 className="text-2xl font-bold mb-2">What's your mobile number?</h1>
        <p className="text-gray-600 mb-6">
          Enter the mobile number where you can be contacted. No one will see this on your profile.
        </p>

        <div className="mb-6">
          <Input
            type="tel"
            placeholder="Mobile number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="h-14 px-4 rounded-lg border-gray-300"
          />
          <p className="text-sm text-gray-500 mt-2">
            You can use your phone number for logging in and two factor authentication.{" "}
            <Link href="/learn-more" className="text-primary hover:underline">
              Learn more
            </Link>
            .
          </p>
        </div>

        <div className="mt-auto space-y-4">
          <Button onClick={handleNext} className="w-full h-14 text-base font-medium" disabled={!phoneNumber}>
            Next
          </Button>

          <Button
            variant="outline"
            onClick={handleEmailSignup}
            className="w-full h-14 text-base font-medium border-gray-300"
          >
            Sign up with email
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
