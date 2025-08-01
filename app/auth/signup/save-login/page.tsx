"use client"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SaveLoginPage() {
  const router = useRouter()

  const handleSave = () => {
    router.push("/auth/signup/terms")
  }

  const handleSkip = () => {
    router.push("/auth/signup/terms")
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="p-4">
        <Link href="/auth/signup/confirm">
          <ChevronLeft className="h-6 w-6" />
        </Link>
      </div>
      <div className="flex-1 flex flex-col p-6">
        <h1 className="text-2xl font-bold mb-2">Save your login info?</h1>
        <p className="text-gray-600 mb-6">
          We'll save the login info for [USER NAME], so you won't need to enter it next time you log in.
        </p>

        <div className="mt-auto space-y-4">
          <Button onClick={handleSave} className="w-full h-14 text-base font-medium">
            Save
          </Button>

          <Button variant="outline" onClick={handleSkip} className="w-full h-14 text-base font-medium border-gray-300">
            Not now
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
