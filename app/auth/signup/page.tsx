"use client"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export default function SignupPage() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push("/auth/signup/name")
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="p-4">
        <Link href="/auth/login">
          <ChevronLeft className="h-6 w-6" />
        </Link>
      </div>
      <div className="flex-1 flex flex-col p-6">
        <h1 className="text-2xl font-bold mb-4">Join One Local</h1>

        <div className="my-6">
          <div className="bg-amber-100 rounded-lg p-4 mb-6">
            <Image
              src="/placeholder.svg?height=150&width=300"
              alt="Join One Local"
              width={300}
              height={150}
              className="w-full h-auto"
            />
          </div>

          <p className="text-base">
            Create an account to connect with friends, family, and locals to share resources, join events, and build
            your community.
          </p>
        </div>

        <div className="mt-auto">
          <Button onClick={handleGetStarted} className="w-full h-14 text-base font-medium">
            Get started
          </Button>
        </div>
      </div>
    </div>
  )
}
