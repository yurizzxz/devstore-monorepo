"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const titles: Record<string, string> = {
  "/": "Dashboard",
  "/products": "Produtos",
  "/users": "Usuários",
  "/settings": "Configurações",
  "/content": "Conteúdo do site",
  "/orders": "Pedidos",
  "/categories": "Categorias",
  "/cart": "Carrinhos",

  //subpages
  "/orders/register": "Cadastrar Pedido",
  "/content/register": "Cadastrar Seção",
  "/users/register": "Cadastrar Usuário",
  "/products/register": "Cadastrar Produto",
  "/categories/register": "Cadastrar Categoria",
};

export function SiteHeader() {
  const pathname = usePathname();
  const title = titles[pathname] || "Página Não Nomeada";

  return (
    <header className="flex bg-sidebar h-[--header-height] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 mb-3 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
      </div>
    </header>
  );
}
