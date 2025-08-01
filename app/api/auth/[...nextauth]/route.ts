import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { users } from "@/lib/mock-data"

// Configure NextAuth
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // This is a mock implementation - in production, you'd verify against a real database
        if (!credentials?.username || !credentials?.password) return null

        const user = users.find((user) => user.username === credentials.username || user.email === credentials.username)

        // In a real app, you would check the password here
        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.avatar,
          }
        }

        return null
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }
