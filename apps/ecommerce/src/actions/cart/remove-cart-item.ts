"use server";

import { authenticatedAction } from "@/actions/authenticated-action";
import { PrismaCartRepository } from "@repo/db/repositories/prisma-cart-repository";
import { RemoveProductFromCart } from "@repo/core/modules/cart/use-cases/remove-product-from-cart";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCartErrorMessage } from "./errors";

const removeCartItemSchema = z.object({
  productId: z.string().min(1),
});

export const removeProductFromCart = authenticatedAction
  .inputSchema(removeCartItemSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const repository = new PrismaCartRepository();

      await new RemoveProductFromCart(repository).execute({
        userId: ctx.userId,
        productId: parsedInput.productId,
      });

      revalidatePath("/", "layout");
      return { success: true };
    } catch (error) {
      throw new Error(getCartErrorMessage(error));
    }
  });
