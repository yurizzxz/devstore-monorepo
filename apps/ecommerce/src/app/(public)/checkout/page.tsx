import { requireCustomer } from "@/lib/require-customer";
import { formatCentsToBRL } from "@repo/utils/money";
import { prisma } from "@repo/prisma/client";
import { Button } from "@repo/ui/components/button";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { CheckoutForm } from "./_components/checkout-form";

export const metadata: Metadata = {
  title: "Finalizar compra",
};

export default async function CheckoutPage() {
  const session = await requireCustomer();
  const [cart, addresses] = await Promise.all([
    prisma.cart.findFirst({
      where: { userId: session.user.id },
      include: {
        items: {
          include: { product: true },
          orderBy: { createdAt: "asc" },
        },
      },
    }),
    prisma.shippingAddress.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const items = cart?.items ?? [];

  return (
    <main className="mx-auto min-h-[70vh] max-w-360 px-4 py-10 sm:px-6 lg:py-16">
      <Link className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white" href="/">
        <ArrowLeft className="size-4" /> Continuar comprando
      </Link>

      <div className="mt-7 grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
        <section>
          <h1 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
            Finalizar compra
          </h1>
          <p className="mt-3 text-zinc-400">
            Confira os produtos e escolha onde deseja receber.
          </p>

          <div className="mt-10">
            <h2 className="text-lg font-semibold">Produtos</h2>
            {items.length === 0 ? (
              <div className="mt-4 border-y border-zinc-800 py-12 text-center">
                <p className="text-zinc-400">Seu carrinho está vazio.</p>
                <Button asChild className="mt-5">
                  <Link href="/products">Ver produtos</Link>
                </Button>
              </div>
            ) : (
              <ul className="mt-4 divide-y divide-zinc-800 border-y border-zinc-800">
                {items.map((item) => (
                  <li className="flex items-center gap-4 py-5" key={item.id}>
                    <Image
                      alt={item.product.name}
                      className="size-20 shrink-0 rounded-md bg-white object-contain p-1"
                      height={80}
                      src={item.product.productImage}
                      width={80}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 font-medium">{item.product.name}</p>
                      <p className="mt-1 text-sm text-zinc-400">Quantidade: {item.quantity}</p>
                    </div>
                    <p className="shrink-0 font-semibold">
                      {formatCentsToBRL(item.product.priceInCents * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <CheckoutForm addresses={addresses} disabled={items.length === 0} />
        </section>

        <aside className="border border-zinc-800 bg-zinc-900/40 p-6 lg:sticky lg:top-44">
          <h2 className="text-lg font-semibold">Resumo</h2>
          <div className="mt-6 flex items-center justify-between border-b border-zinc-800 pb-5">
            <span className="text-zinc-400">Subtotal exibido</span>
            <span className="text-xl font-semibold">
              {formatCentsToBRL(cart?.totalInCents ?? 0)}
            </span>
          </div>
          <p className="mt-5 flex gap-3 text-sm leading-6 text-zinc-400">
            <LockKeyhole className="mt-0.5 size-4 shrink-0 text-primary" />
            Preços, promoções e estoque serão recalculados no servidor ao confirmar.
          </p>
        </aside>
      </div>
    </main>
  );
}
