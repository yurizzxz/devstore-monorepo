import { requireSession } from "@repo/auth/lib/require-session";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function requireCustomer() {
  try {
    return await requireSession(await headers());
  } catch {
    redirect("/authentication");
  }
}
