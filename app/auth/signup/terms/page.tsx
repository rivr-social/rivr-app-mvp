"use client"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function TermsPage() {
  const router = useRouter()

  const handleAgree = () => {
    router.push("/auth/signup/login-method")
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="p-4">
        <Link href="/auth/signup/save-login">
          <ChevronLeft className="h-6 w-6" />
        </Link>
      </div>
      <div className="flex-1 flex flex-col p-6">
        <h1 className="text-2xl font-bold mb-4">Agree to One Local's terms and policies.</h1>
        <p className="text-gray-600 mb-6">Your data is safe with One Local.</p>

        <p className="mb-6">
          By tapping, <strong>I agree</strong>, you agree to create an account and to One Local's{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms
          </Link>
          ,{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          , and{" "}
          <Link href="/eula" className="text-primary hover:underline">
            EULA
          </Link>
          .
        </p>

        <div className="mt-auto">
          <Button onClick={handleAgree} className="w-full h-14 text-base font-medium">
            I agree
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
