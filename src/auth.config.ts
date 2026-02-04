import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/signup',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDrive = nextUrl.pathname.startsWith('/drive')
      const isOnAuth = nextUrl.pathname.startsWith('/auth')

      if (isOnDrive) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      } else if (isOnAuth) {
        if (isLoggedIn) {
          return Response.redirect(new URL('/drive', nextUrl))
        }
        return true
      }
      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig
