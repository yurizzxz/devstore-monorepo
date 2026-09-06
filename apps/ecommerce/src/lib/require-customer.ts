import { UnauthorizedError } from "@repo/auth/lib/errors";
import { requireSession } from "@repo/auth/lib/require-session";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function requireCustomer() {
  try {
    return await requireSession(await headers());
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      redirect("/authentication");
    }

    throw error;
  }
}
