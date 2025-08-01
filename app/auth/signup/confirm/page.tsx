"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default function ConfirmPage() {
  const [code, setCode] = useState("")
  const router = useRouter()

  const handleContinue = () => {
    if (code) {
      router.push("/auth/signup/save-login")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="p-4">
        <Link href="/auth/signup/email">
          <ChevronLeft className="h-6 w-6" />
        </Link>
      </div>
      <div className="flex-1 flex flex-col p-6">
        <h1 className="text-2xl font-bold mb-2">Confirm your account</h1>
        <p className="text-gray-600 mb-6">We sent a code via SMS. Enter that code to confirm your account.</p>

        <div className="bg-amber-100 rounded-lg p-4 mb-6 flex justify-center">
          <Image
            src="/placeholder.svg?height=150&width=150"
            alt="SMS Confirmation"
            width={150}
            height={150}
            className="h-auto"
          />
        </div>

        <div className="mb-6">
          <Input
            type="text"
            placeholder="Enter code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="h-14 px-4 rounded-lg border-gray-300"
          />
        </div>

        <div className="space-y-4">
          <Button onClick={handleContinue} className="w-full h-14 text-base font-medium" disabled={!code}>
            Continue
          </Button>

          <Button variant="outline" className="w-full h-14 text-base font-medium border-gray-300">
            Didn't get a code?
          </Button>
        </div>
      </div>
    </div>
  )
}
