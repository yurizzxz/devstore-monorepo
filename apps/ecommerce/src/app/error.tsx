"use client";

import { Button } from "@repo/ui/components/button";
import { RotateCcw, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto grid min-h-[70vh] max-w-360 place-items-center px-4 py-16 sm:px-6">
      <section className="max-w-xl text-center" role="alert">
        <TriangleAlert
          aria-hidden="true"
          className="mx-auto size-12 text-amber-300"
        />
        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-4xl">
          Não foi possível carregar esta página
        </h1>
        <p className="mx-auto mt-4 max-w-lg leading-7 text-zinc-300 text-pretty">
          Houve uma falha temporária. Tente novamente agora ou volte ao início
          para continuar navegando.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={reset} size="lg" type="button">
            <RotateCcw aria-hidden="true" />
            Tentar novamente
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/">Voltar para o início</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
