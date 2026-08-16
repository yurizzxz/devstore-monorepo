"use server";

import { authenticatedAction } from "@/actions/authenticated-action";
import { PrismaCartRepository } from "@repo/db/repositories/prisma-cart-repository";
import { UpdateCartItemQuantity } from "@repo/core/modules/cart/use-cases/update-cart-item-quantity";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCartErrorMessage } from "./errors";

const updateCartItemQuantitySchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
});

export const updateCartItemQuantity = authenticatedAction
  .inputSchema(updateCartItemQuantitySchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const repository = new PrismaCartRepository();

      await new UpdateCartItemQuantity(repository).execute({
        userId: ctx.userId,
        productId: parsedInput.productId,
        quantity: parsedInput.quantity,
      });

      revalidatePath("/", "layout");
      return { success: true };
    } catch (error) {
      throw new Error(getCartErrorMessage(error));
    }
  });
