import { Button } from "@repo/ui/components/button";
import { CircleX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pagamento cancelado",
};

export default function CheckoutCancelPage() {
  return (
    <main className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-4 py-16 text-center">
      <section>
        <CircleX className="mx-auto size-14 text-zinc-400" />
        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
          Pagamento não concluído
        </h1>
        <p className="mx-auto mt-4 max-w-xl leading-7 text-zinc-400">
          Nenhuma confirmação de pagamento foi recebida. O pedido continuará
          aguardando até a sessão expirar.
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
    </main>
  );
}
