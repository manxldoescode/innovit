import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

type BetterAuthSession = Awaited<ReturnType<typeof auth.api.getSession>>

/**
 * Get the current Better Auth session or null if unauthenticated.
 * Works in Route Handlers, Server Actions, and RSCs.
 */
export async function getSessionOrNull(): Promise<BetterAuthSession | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return null
    }

    return session
  } catch (error) {
    console.error('Error getting Better Auth session:', error)
    return null
  }
}

/**
 * Get the authenticated user's ID or throw if not authenticated.
 */
export async function getUserId(): Promise<string> {
  const session = await getSessionOrNull()

  if (!session?.user?.id) {
    throw new Error('Unauthorized: No authenticated user')
  }

  return session.user.id
}

/**
 * Get the authenticated user object or throw if not authenticated.
 */
export async function getUser() {
  const session = await getSessionOrNull()

  if (!session?.user) {
    throw new Error('Unauthorized: No authenticated user')
  }

  return session.user
}

