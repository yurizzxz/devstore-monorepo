import { requireCustomer } from "@/lib/require-customer";
import { Button } from "@repo/ui/components/button";
import { CalendarDays, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { EmailForm } from "./_components/email-form";
import { PasswordForm } from "./_components/password-form";
import { ProfileForm } from "./_components/profile-form";

export const metadata: Metadata = {
  title: "Meu perfil",
};

export default async function ProfilePage() {
  const session = await requireCustomer();
  const { user } = session;

  return (
    <section className="mx-auto min-h-[70vh] max-w-360 px-4 py-10 sm:px-6 lg:py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div>
          <header className="border-b border-zinc-800 pb-7">
            <p className="text-sm font-medium text-primary">Sua conta</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Perfil e segurança
            </h1>
            <p className="mt-3 max-w-2xl text-zinc-400">
              Atualize seus dados de acesso e informações exibidas na loja.
            </p>
          </header>

          <ProfileForm key={user.name} name={user.name} />
          <EmailForm key={user.email} email={user.email} />
          <PasswordForm />
        </div>

        <aside className="border border-zinc-800 bg-zinc-900/40 p-6 lg:sticky lg:top-44">
          <div className="flex items-center gap-4">
            <div className="grid size-14 shrink-0 place-items-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold">{user.name}</p>
              <p className="truncate text-sm text-zinc-400">{user.email}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4 border-t border-zinc-800 pt-5 text-sm">
            <p className="flex items-center gap-3 text-zinc-300">
              <ShieldCheck className="size-4 text-primary" />
              {user.emailVerified ? "E-mail verificado" : "E-mail não verificado"}
            </p>
            <p className="flex items-center gap-3 text-zinc-300">
              <CalendarDays className="size-4 text-primary" />
              Conta desde {accountDateFormatter.format(user.createdAt)}
            </p>
          </div>

          <nav
            aria-label="Atalhos da conta"
            className="mt-6 grid gap-2 border-t border-zinc-800 pt-5"
          >
            <Button asChild variant="ghost">
              <Link href="/addresses">Gerenciar endereços</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/orders">Ver pedidos</Link>
            </Button>
          </nav>
        </aside>
      </div>
    </section>
  );
}

const accountDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
});
