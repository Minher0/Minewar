import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Generate a stable secret for production if not provided
// In production, you should set NEXTAUTH_SECRET environment variable
const getSecret = () => {
  if (process.env.NEXTAUTH_SECRET) {
    return process.env.NEXTAUTH_SECRET
  }
  // Fallback: generate a hash based on a stable value
  // WARNING: In production, always set NEXTAUTH_SECRET in environment variables
  if (process.env.NODE_ENV === 'production') {
    console.warn('WARNING: NEXTAUTH_SECRET not set. Using fallback. Please set NEXTAUTH_SECRET environment variable.')
    // Use a stable fallback based on the admin password hash
    return 'minewar-secret-fallback-' + Buffer.from('admin:31122010').toString('base64')
  }
  return 'dev-secret-not-for-production'
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Hardcoded admin credentials as specified
        if (
          credentials?.username === 'admin' &&
          credentials?.password === '31122010'
        ) {
          return {
            id: '1',
            name: 'Admin',
            email: 'admin@minewar.local',
            role: 'admin'
          }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = 'admin'
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string
      }
      return session
    }
  },
  secret: getSecret(),
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
