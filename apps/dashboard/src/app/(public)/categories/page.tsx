"use client";
import { useState } from "react";
import { SiteHeader } from "@/components/dashboard/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import {HeadingTitle} from "@/components/ui/heading";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/buttonUi";
import Link from "next/link";
import { useCategories } from "@/hooks/categories/useCategories";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function Page() {
  const categories = useCategories();

  const [promotionFilter, setPromotionFilter] = useState("all");

  const filteredCategories = categories.filter((category) => {
    if (promotionFilter === "all") return true;
    return String(category.promotion) === promotionFilter;
  });

  return (
    <SidebarInset>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex px-4 lg:px-6 flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center justify-between">
              <HeadingTitle>Categorias</HeadingTitle>
              <div className="flex items-center gap-4">
              <div className="w-full max-w-xs">
              <Select
                value={promotionFilter}
                onValueChange={setPromotionFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por promoção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="1">Com promoção</SelectItem>
                  <SelectItem value="0">Sem promoção</SelectItem>
                </SelectContent>
              </Select>
            </div>
                <Link href="/categories/register">
                  <Button>Adicionar Categoria</Button>
                </Link>
              </div>
            </div>

          

            <DataTable
              data={filteredCategories}
              type="categories"
              withPagination
              itemsPerPage={20}
            />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
