import { CancelOrder } from "@repo/core/modules/orders/use-cases/cancel-order";
import { ConfirmOrderPayment } from "@repo/core/modules/orders/use-cases/confirm-order-payment";
import { PrismaOrderRepository } from "@repo/db/repositories/prisma-order-repository";
import {
  stripe,
  type Stripe,
} from "@repo/lib/stripe/client";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature) {
    return new Response("Assinatura ausente.", { status: 400 });
  }

  if (!webhookSecret) {
    return new Response("Webhook Stripe não configurado.", { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return new Response("Assinatura inválida.", { status: 400 });
  }

  try {
    await processStripeEvent(event);
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Falha ao processar webhook Stripe", error);
    return new Response("Falha ao processar evento.", { status: 500 });
  }
}

async function processStripeEvent(event: Stripe.Event) {
  const repository = new PrismaOrderRepository();

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object;

      if (session.payment_status !== "paid") return;

      await new ConfirmOrderPayment(repository).execute({
        orderId: getOrderId(session),
        checkoutSessionId: session.id,
        paymentIntentId: getPaymentIntentId(session),
      });

      revalidatePath("/checkout/success");
      revalidatePath("/orders");
      return;
    }

    case "checkout.session.expired":
    case "checkout.session.async_payment_failed": {
      const session = event.data.object;

      await new CancelOrder(repository).execute(getOrderId(session));
      revalidateTag("products");
      revalidatePath("/orders");
      return;
    }
  }
}

function getOrderId(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;

  if (!orderId) {
    throw new Error(`Pedido ausente na sessão Stripe ${session.id}.`);
  }

  return orderId;
}

function getPaymentIntentId(session: Stripe.Checkout.Session) {
  if (typeof session.payment_intent === "string") {
    return session.payment_intent;
  }

  return session.payment_intent?.id;
}
