import CartList from "@/components/ui/cart-list";
import { Menu, ShoppingCart, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "@/components/common/searchbar";
import { PromotionsBar } from "./promotions-bar";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@repo/ui/components/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui/components/sheet";
import { Button } from "@repo/ui/components/button";

type HeaderProps = {
  user: {
    name: string;
    image: string;
    email: string;
  } | null;
  categories: {
    id: string;
    name: string;
  }[];
};

export const Header = ({ user, categories }: HeaderProps) => {
  return (
    <>
      <header className="sticky top-0 w-full z-20 bg-background border-b border-zinc-800">
        <PromotionsBar />
        <nav className="max-w-360 mx-auto px-3 pb-4">
          <div className="py-5 w-full flex justify-between items-center">
            <Link href="/">
              <Image
                alt="DevStore"
                src="/devstore.png"
                width={125}
                height={120}
                className="md:w-50 h-auto"
              />
            </Link>

            <div className="hidden md:flex px-16 mt-1 w-full">
              <SearchBar />
            </div>

            <div className="flex items-center space-x-5">
              <div className="hidden md:block">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <User className="size-7" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Link href="/profile">Perfil</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/orders">Pedidos</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/logout">Sair</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button asChild variant="ghost" className="md:px-2 md:py-1">
                    <Link
                      href="/login"
                      className="flex flex-row items-center gap-2"
                    >
                      <User className="size-7" />
                      <span className="hidden md:block text-md">
                        Entrar / Cadastrar
                      </span>
                    </Link>
                  </Button>
                )}
              </div>

              <Sheet>
                <SheetTrigger className="flex flex-row items-center gap-2 cursor-pointer">
                  <ShoppingCart className="size-7" />
                  <span className="hidden md:block text-md">Carrinho</span>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Carrinho</SheetTitle>
                  </SheetHeader>

                  <CartList />
                </SheetContent>
              </Sheet>

              <div className="md:hidden flex gap-3">
                <Sheet side="right">
                  <SheetTrigger className="md:hidden text-white">
                    <Menu className="size-7" />
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    {user ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <User className="size-7" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Link href="/profile">Perfil</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link href="/orders">Pedidos</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link href="/logout">Sair</Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Button
                        asChild
                        variant="ghost"
                        className="md:px-2 md:py-1"
                      >
                        <Link
                          href="/login"
                          className="flex flex-row items-center gap-2"
                        >
                          <User className="size-7" />
                          <span className="hidden md:block text-md">
                            Entrar / Cadastrar
                          </span>
                        </Link>
                      </Button>
                    )}

                    <nav aria-label="Categorias" className="mt-4">
                      <p className="mb-2 text-sm font-semibold">Categorias</p>
                      <ul className="space-y-2">
                        {categories.map((category) => (
                          <li key={category.id}>
                            <Link href={`/categories/${category.id}`}>
                              {category.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>

          <div className="flex md:hidden py-2 w-full">
            <SearchBar />
          </div>

          <div className="hidden md:flex items-center justify-center py-2">
            <ul className="flex flex-row space-x-10 items-center">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link href={`/categories/${category.id}`}>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
};
