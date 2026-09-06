"use server";

import { authenticatedAction } from "@/actions/authenticated-action";
import { RemoveAddress } from "@repo/core/modules/addresses/use-cases/remove-address";
import { PrismaAddressRepository } from "@repo/db/repositories/prisma-address-repository";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getRemoveAddressErrorMessage } from "./errors";

const removeAddressSchema = z.object({
  id: z.string().min(1),
});

export const removeAddress = authenticatedAction
  .inputSchema(removeAddressSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const repository = new PrismaAddressRepository();

      await new RemoveAddress(repository).execute({
        id: parsedInput.id,
        userId: ctx.userId,
      });

      revalidatePath("/", "layout");
      return { success: true };
    } catch (error) {
      throw new Error(getRemoveAddressErrorMessage(error));
    }
  });
