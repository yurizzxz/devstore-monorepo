"use server";

import { authenticatedAction } from "@/actions/authenticated-action";
import { PrismaCartRepository } from "@repo/db/repositories/prisma-cart-repository";
import { AddProductToCart } from "@repo/core/modules/cart/use-cases/add-product-to-cart";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCartErrorMessage } from "./errors";

const createCartSchema = z.object({
  productId: z.string().min(1),
});

export const addProductToCart = authenticatedAction
  .inputSchema(createCartSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const repository = new PrismaCartRepository();

      await new AddProductToCart(repository).execute({
        userId: ctx.userId,
        productId: parsedInput.productId,
      });

      revalidatePath("/", "layout");
      return { success: true };
    } catch (error) {
      throw new Error(getCartErrorMessage(error));
    }
  });
