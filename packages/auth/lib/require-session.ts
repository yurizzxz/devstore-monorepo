import { auth } from "./auth"

export async function requireSession(requestHeaders: Headers) {
  const session = await auth.api.getSession({
    headers: requestHeaders,
  })

  if (!session) {
    throw new Error("UNAUTHORIZED")
  }

  return session
}