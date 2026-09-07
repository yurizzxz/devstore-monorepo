"use server";

import { authenticatedAction } from "@/actions/authenticated-action";
import { auth } from "@repo/auth/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { updateProfileSchema } from "./schemas";

export const updateProfile = authenticatedAction
  .inputSchema(updateProfileSchema)
  .action(async ({ parsedInput }) => {
    try {
      await auth.api.updateUser({
        headers: await headers(),
        body: {
          name: parsedInput.name,
        },
      });

      revalidatePath("/", "layout");
      return { success: true };
    } catch {
      throw new Error("Não foi possível atualizar seu perfil.");
    }
  });
