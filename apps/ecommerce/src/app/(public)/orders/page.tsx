import { requireCustomer } from "@/lib/require-customer";
import { formatCentsToBRL } from "@repo/utils/money";
import { prisma } from "@repo/prisma/client";
import { Button } from "@repo/ui/components/button";
import { Clock3, PackageCheck, PackageX } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Meus pedidos",
};

const statusContent = {
  PENDING_PAYMENT: {
    label: "Aguardando pagamento",
    className: "bg-amber-400/10 text-amber-300",
    icon: Clock3,
  },
  SUCCESS_PAYMENT: {
    label: "Pagamento confirmado",
    className: "bg-emerald-400/10 text-emerald-300",
    icon: PackageCheck,
  },
  CANCELLED: {
    label: "Cancelado",
    className: "bg-red-400/10 text-red-300",
    icon: PackageX,
  },
} as const;

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function OrdersPage() {
  const session = await requireCustomer();
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  return (
    <main className="mx-auto min-h-[70vh] max-w-360 px-4 py-10 sm:px-6 lg:py-16">
      <div className="border-b border-zinc-800 pb-7">
        <p className="text-sm font-medium text-primary">Sua conta</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
          Meus pedidos
        </h1>
        <p className="mt-3 text-zinc-400">
          Acompanhe pagamentos e consulte os produtos de cada compra.
        </p>
      </div>

      {orders.length === 0 ? (
        <section className="py-20 text-center">
          <PackageCheck className="mx-auto size-11 text-primary" />
          <h2 className="mt-5 text-xl font-semibold">Você ainda não fez pedidos</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
            Quando finalizar uma compra, ela aparecerá aqui com todos os detalhes.
          </p>
          <Button asChild className="mt-6">
            <Link href="/products">Explorar produtos</Link>
          </Button>
        </section>
      ) : (
        <div className="divide-y divide-zinc-800">
          {orders.map((order) => {
            const status = statusContent[order.status];
            const StatusIcon = status.icon;

            return (
              <article className="py-8" key={order.id}>
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold">Pedido #{order.id.slice(-8).toUpperCase()}</p>
                    <p className="mt-1 text-sm text-zinc-400">
                      {dateFormatter.format(order.createdAt)} · {order.items.length} {order.items.length === 1 ? "item" : "itens"}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${status.className}`}>
                      <StatusIcon className="size-4" /> {status.label}
                    </span>
                    <strong className="text-lg">{formatCentsToBRL(order.totalPriceInCents)}</strong>
                  </div>
                </div>

                <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
                  {order.items.map((item) => (
                    <Link
                      className="flex min-w-64 items-center gap-3 border border-zinc-800 p-3 transition-colors hover:border-zinc-600"
                      href={`/product/${item.product.slug}`}
                      key={item.id}
                    >
                      <Image
                        alt={item.product.name}
                        className="size-14 shrink-0 rounded-md bg-white object-contain p-1"
                        height={56}
                        src={item.product.productImage}
                        width={56}
                      />
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-medium">{item.product.name}</p>
                        <p className="mt-1 text-xs text-zinc-400">{item.quantity} × {formatCentsToBRL(item.priceInCents)}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                <p className="mt-5 text-sm text-zinc-400">
                  Entrega: {order.street}, {order.number} · {order.city}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
