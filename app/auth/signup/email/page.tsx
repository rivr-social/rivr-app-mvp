"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function EmailPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleNext = () => {
    if (email && password) {
      router.push("/auth/signup/confirm")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="p-4">
        <Link href="/auth/signup/phone">
          <ChevronLeft className="h-6 w-6" />
        </Link>
      </div>
      <div className="flex-1 flex flex-col p-6">
        <h1 className="text-2xl font-bold mb-2">What's your email?</h1>
        <p className="text-gray-600 mb-6">
          Enter the email where you can be contacted. No one will see this on your profile.
        </p>

        <div className="mb-6">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-14 px-4 rounded-lg border-gray-300"
          />
          <p className="text-sm text-gray-500 mt-2">
            You'll also receive emails from us and can opt out anytime.{" "}
            <Link href="/learn-more" className="text-primary hover:underline">
              Learn more
            </Link>
            .
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-2">Create a password</h2>
        <p className="text-gray-600 mb-6">
          Create a password with at least 6 letters or numbers. It should be something others can't guess.
        </p>

        <div className="mb-6 relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-14 px-4 rounded-lg border-gray-300 pr-12"
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
          </button>
        </div>

        <div className="mt-auto">
          <Button onClick={handleNext} className="w-full h-14 text-base font-medium" disabled={!email || !password}>
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
