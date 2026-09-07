"use server";

import { authenticatedAction } from "@/actions/authenticated-action";
import { auth } from "@repo/auth/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { updateEmailSchema } from "./schemas";

export const updateEmail = authenticatedAction
  .inputSchema(updateEmailSchema)
  .action(async ({ parsedInput }) => {
    try {
      await auth.api.changeEmail({
        headers: await headers(),
        body: {
          newEmail: parsedInput.email,
          callbackURL: "/profile",
        },
      });

      revalidatePath("/", "layout");
      return { success: true };
    } catch {
      throw new Error("Não foi possível atualizar seu e-mail.");
    }
  });
