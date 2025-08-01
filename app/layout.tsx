import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { GlobalHeader } from "@/components/global-header"
import { AppProvider } from "@/contexts/app-context"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ONE Local",
  description: "Social coordination platform for communities",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AppProvider>
            <GlobalHeader />
            <main className="pt-16 pb-16 md:pb-0">{children}</main>
            <Toaster />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
