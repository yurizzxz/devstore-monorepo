import { auth } from "./auth"
import { UnauthorizedError } from "./errors"

export async function requireSession(requestHeaders: Headers) {
  const session = await auth.api.getSession({
    headers: requestHeaders,
  })

  if (!session) {
    throw new UnauthorizedError()
  }

  return session
}
