"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function LoginMethodPage() {
  const [method, setMethod] = useState("sms")
  const router = useRouter()

  const handleContinue = () => {
    router.push("/")
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="p-4">
        <Link href="/auth/signup/terms">
          <ChevronLeft className="h-6 w-6" />
        </Link>
      </div>
      <div className="flex-1 flex flex-col p-6">
        <div className="flex justify-center mb-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User" />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
        </div>

        <h2 className="text-xl font-semibold text-center mb-6">User Name</h2>
        <p className="text-center mb-6">Choose a way to log in.</p>

        <RadioGroup value={method} onValueChange={setMethod} className="space-y-4">
          <div
            className={`border ${method === "sms" ? "border-primary" : "border-gray-300"} rounded-lg p-4 flex items-center`}
          >
            <RadioGroupItem value="sms" id="sms" className="mr-4" />
            <Label htmlFor="sms" className="flex-1 cursor-pointer">
              Get code or link via SMS
            </Label>
            {method === "sms" && <Check className="h-5 w-5 text-primary" />}
          </div>

          <div
            className={`border ${method === "password" ? "border-primary" : "border-gray-300"} rounded-lg p-4 flex items-center`}
          >
            <RadioGroupItem value="password" id="password" className="mr-4" />
            <Label htmlFor="password" className="flex-1 cursor-pointer">
              Enter password to log in
            </Label>
            {method === "password" && <Check className="h-5 w-5 text-primary" />}
          </div>
        </RadioGroup>

        <div className="mt-auto">
          <Button onClick={handleContinue} className="w-full h-14 text-base font-medium">
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
