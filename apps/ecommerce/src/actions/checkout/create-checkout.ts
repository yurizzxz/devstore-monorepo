"use server";

import { CreateOrder } from "@repo/core/modules/orders/use-cases/create-order";
import { CancelOrder } from "@repo/core/modules/orders/use-cases/cancel-order";
import { PrismaOrderRepository } from "@repo/db/repositories/prisma-order-repository";
import { stripe } from "@repo/lib/stripe/client";
import { revalidatePath, revalidateTag } from "next/cache";
import z from "zod";

import { getCreateOrderErrorMessage } from "../order/errors";
import { authenticatedAction } from "../authenticated-action";

const createCheckoutSchema = z.object({
  shippingAddressId: z.string().min(1),
});
export const createCheckout = authenticatedAction
  .inputSchema(createCheckoutSchema)
  .action(async ({ parsedInput, ctx }) => {
    const appUrl = process.env.APP_URL ?? process.env.BETTER_AUTH_URL;

    if (!appUrl) {
      throw new Error("APP_URL não definida.");
    }

    const repository = new PrismaOrderRepository();
    let orderId: string | undefined;
    let checkoutSessionId: string | undefined;

    try {
      const order = await new CreateOrder(repository).execute({
        userId: ctx.userId,
        shippingAddressId: parsedInput.shippingAddressId,
      });
      orderId = order.id;

      const session = await stripe.checkout.sessions.create(
        {
          mode: "payment",
          payment_method_types: ["card"],
          payment_method_options: {
            card: {
              installments: {
                enabled: false,
              },
            },
          },
          customer_email: order.email,
          line_items: order.items.map((item) => ({
            quantity: item.quantity,
            price_data: {
              currency: "brl",
              unit_amount: item.priceInCents,
              product_data: { name: item.productName },
            },
          })),
          metadata: {
            orderId: order.id,
            userId: ctx.userId,
          },
          success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${appUrl}/checkout/cancel`,
          expires_at: Math.floor(order.expiresAt.getTime() / 1000),
        },
        { idempotencyKey: `checkout:${order.id}` },
      );
      checkoutSessionId = session.id;

      if (!session.url) {
        throw new Error("Stripe não retornou URL de checkout.");
      }

      const sessionAttached = await repository.setCheckoutSessionId({
        orderId: order.id,
        checkoutSessionId: session.id,
      });

      if (!sessionAttached) {
        throw new Error("Não foi possível vincular o checkout ao pedido.");
      }

      revalidateTag("products");
      revalidatePath("/", "layout");

      return { checkoutUrl: session.url };
    } catch (error) {
      if (checkoutSessionId) {
        await stripe.checkout.sessions
          .expire(checkoutSessionId)
          .catch(() => undefined);
      }

      if (orderId) {
        await new CancelOrder(repository)
          .execute(orderId)
          .catch(() => undefined);
        revalidateTag("products");
      }

      throw new Error(getCreateOrderErrorMessage(error));
    }
  });
