"use server";

import { authenticatedAction } from "@/actions/authenticated-action";
import { CreateOrder } from "@repo/core/modules/orders/use-cases/create-order";
import { PrismaOrderRepository } from "@repo/db/repositories/prisma-order-repository";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

import { getCreateOrderErrorMessage } from "./errors";

const createOrderSchema = z.object({
  shippingAddressId: z.string().min(1),
});

export const createOrder = authenticatedAction
  .inputSchema(createOrderSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const repository = new PrismaOrderRepository();

      const order = await new CreateOrder(repository).execute({
        userId: ctx.userId,
        shippingAddressId: parsedInput.shippingAddressId,
      });

      revalidateTag("products");
      revalidatePath("/", "layout");
      return { success: true, orderId: order.id };
    } catch (error) {
      throw new Error(getCreateOrderErrorMessage(error));
    }
  });
