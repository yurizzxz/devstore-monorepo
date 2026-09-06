import { actionClient } from "@/lib/safe-action";
import { requireSession } from "@repo/auth/lib/require-session";
import { headers } from "next/headers";
  
export const authenticatedAction = actionClient.use(async ({ next }) => {
  const session = await requireSession(await headers())

  return next({
    ctx: {
      userId: session.user.id,
    },
  });
});
