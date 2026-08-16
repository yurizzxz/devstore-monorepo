import { actionClient } from "@/lib/safe-action";
import { auth } from "@repo/auth/lib/auth";
import { headers } from "next/headers";

export const authenticatedAction = actionClient.use(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Faça login para continuar.");
  }

  return next({
    ctx: {
      userId: session.user.id,
    },
  });
});
