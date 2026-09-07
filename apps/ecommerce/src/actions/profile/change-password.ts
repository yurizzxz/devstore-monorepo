"use server";

import { authenticatedAction } from "@/actions/authenticated-action";
import { auth } from "@repo/auth/lib/auth";
import { headers } from "next/headers";

import { changePasswordSchema } from "./schemas";

export const changePassword = authenticatedAction
  .inputSchema(changePasswordSchema)
  .action(async ({ parsedInput }) => {
    try {
      await auth.api.changePassword({
        headers: await headers(),
        body: {
          currentPassword: parsedInput.currentPassword,
          newPassword: parsedInput.newPassword,
          revokeOtherSessions: false,
        },
      });

      return { success: true };
    } catch {
      throw new Error("Senha atual inválida ou nova senha não permitida.");
    }
  });
