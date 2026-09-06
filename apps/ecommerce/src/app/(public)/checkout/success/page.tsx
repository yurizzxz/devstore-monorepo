import { requireCustomer } from "@/lib/require-customer";
import { prisma } from "@repo/prisma/client";
import { Button } from "@repo/ui/components/button";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PaymentStatusRefresh } from "./payment-status-refresh";

export const metadata: Metadata = {
  title: "Status do pagamento",
};

type CheckoutSuccessPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

const statusContent = {
  PENDING_PAYMENT: {
    title: "Pagamento em processamento",
    description:
      "A Stripe recebeu seu checkout. Estamos aguardando a confirmação segura do pagamento.",
    icon: Clock3,
    iconClassName: "text-amber-300",
  },
  SUCCESS_PAYMENT: {
    title: "Pagamento confirmado",
    description: "Seu pagamento foi confirmado e o pedido seguirá para preparação.",
    icon: CheckCircle2,
    iconClassName: "text-emerald-400",
  },
  CANCELLED: {
    title: "Pagamento não concluído",
    description: "O pedido foi cancelado e o estoque reservado foi devolvido.",
    icon: XCircle,
    iconClassName: "text-red-400",
  },
} as const;

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const [{ session_id: sessionId }, session] = await Promise.all([
    searchParams,
    requireCustomer(),
  ]);

  if (!sessionId) notFound();

  const order = await prisma.order.findFirst({
    where: {
      userId: session.user.id,
      stripeCheckoutSessionId: sessionId,
    },
    select: { id: true, status: true },
  });

  if (!order) notFound();

  const content = statusContent[order.status];
  const StatusIcon = content.icon;

  return (
    <main className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-4 py-16 text-center">
      <section>
        <StatusIcon className={`mx-auto size-14 ${content.iconClassName}`} />
        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
          {content.title}
        </h1>
        <p className="mx-auto mt-4 max-w-xl leading-7 text-zinc-400">
          {content.description}
        </p>
        <p className="mt-3 text-sm text-zinc-500">
          Pedido #{order.id.slice(-8).toUpperCase()}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/orders">Ver meus pedidos</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/">Voltar à loja</Link>
          </Button>
        </div>
      </section>

      <PaymentStatusRefresh active={order.status === "PENDING_PAYMENT"} />
    </main>
  );
}
