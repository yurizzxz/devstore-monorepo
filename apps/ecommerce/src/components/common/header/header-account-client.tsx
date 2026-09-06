"use client";

import CartList, { type CartView } from "@/components/ui/cart-list";
import { authClient } from "@repo/auth/lib/auth-client";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui/components/sheet";
import { Menu, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { HeaderCategory } from "./header";

type HeaderAccountClientProps = {
  user: {
    name: string;
    email: string;
  } | null;
  categories: HeaderCategory[];
  cart: CartView | null;
};

function AccountMenu({
  user,
  onSignOut,
}: {
  user: HeaderAccountClientProps["user"];
  onSignOut: () => Promise<void>;
}) {
  if (!user) {
    return (
      <Button asChild className="md:px-2 md:py-1" variant="ghost">
        <Link className="flex flex-row items-center gap-2" href="/authentication">
          <User className="size-7" />
          <span className="hidden text-base md:block">Entrar / Cadastrar</span>
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex cursor-pointer flex-row items-center gap-2">
        <User className="size-7" />
        <span>{user.name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href="/profile">Perfil</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/orders">Pedidos</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/addresses">Endereços</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Button className="w-full" onClick={onSignOut} variant="destructive">
            Sair
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function HeaderAccountClient({
  user,
  categories,
  cart,
}: HeaderAccountClientProps) {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Sessão encerrada com sucesso");
          router.refresh();
        },
        onError: (ctx) => {
          toast.error(ctx.error.message ?? "Não foi possível sair da conta");
        },
      },
    });
  }

  return (
    <div className="flex items-center space-x-5">
      <div className="hidden md:block">
        <AccountMenu onSignOut={handleSignOut} user={user} />
      </div>

      <Sheet>
        <SheetTrigger className="flex cursor-pointer flex-row items-center gap-2">
          <ShoppingCart className="size-7" />
          <span className="hidden text-base md:block">Carrinho</span>
        </SheetTrigger>
        <SheetContent>
          {user ? (
            <>
              <SheetHeader>
                <SheetTitle>Carrinho</SheetTitle>
              </SheetHeader>
              <CartList cart={cart} />
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <span className="text-base">Você precisa estar logado</span>
              <Button asChild className="mt-3 md:px-2 md:py-1" variant="ghost">
                <Link className="flex flex-row items-center gap-2" href="/authentication">
                  <User className="size-7" /> Entrar / Cadastrar
                </Link>
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <div className="flex gap-3 md:hidden">
        <Sheet side="right">
          <SheetTrigger aria-label="Abrir menu" className="text-white">
            <Menu className="size-7" />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>

            <div className="mt-4">
              <AccountMenu onSignOut={handleSignOut} user={user} />
            </div>

            <nav aria-label="Categorias" className="mt-8">
              <p className="mb-3 text-sm font-semibold">Categorias</p>
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link href={`/products/${category.slug}`}>{category.name}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
