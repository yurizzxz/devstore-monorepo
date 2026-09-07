import { Button } from "@repo/ui/components/button";
import { Home, SearchX, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-[70vh] max-w-360 place-items-center px-4 py-16 sm:px-6">
      <section className="max-w-xl text-center">
        <SearchX
          aria-hidden="true"
          className="mx-auto size-12 text-primary"
        />
        <p className="mt-6 text-sm font-medium text-zinc-300">Erro 404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-4xl">
          Página não encontrada
        </h1>
        <p className="mx-auto mt-4 max-w-lg leading-7 text-zinc-300 text-pretty">
          Este endereço não existe ou o conteúdo foi movido. Continue navegando
          pela loja para encontrar o produto certo.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/products">
              <ShoppingBag aria-hidden="true" />
              Ver produtos
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/">
              <Home aria-hidden="true" />
              Voltar para o início
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
