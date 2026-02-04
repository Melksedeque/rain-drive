import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { authConfig } from "@/auth.config"

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          
          try {
            const user = await prisma.user.findUnique({ where: { email } })
            if (!user) return null

            const passwordsMatch = await bcrypt.compare(password, user.passwordHash)
            if (passwordsMatch) {
                const { passwordHash, ...userWithoutPassword } = user
                return userWithoutPassword
            }
          } catch (error) {
            console.error("Auth error:", error)
            return null
          }
        }

        return null
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
})
