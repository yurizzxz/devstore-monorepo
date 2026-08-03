"use client";
import { SiteHeader } from "@/components/dashboard/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { HeadingTitle } from "@/components/ui/heading";
import { DataTable } from "@/components/table/data-table";
import { useOrders } from "@/hooks/orders/useOrders";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

export default function Page() {
  const orders = useOrders();

  const [orderFilter, setOrderFilter] = useState("all");

  const filteredOrders = orders.filter((orders) => {
    if (orderFilter === "all") return true;
    return String(orders.status) === orderFilter;
  });

  return (
    <SidebarInset>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex px-4 lg:px-6 flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center justify-between">
              <HeadingTitle>Pedidos</HeadingTitle>
              <div className="flex items-center gap-4">
                <div className="w-full max-w-xs">
                  <Select value={orderFilter} onValueChange={setOrderFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="0">Pendente</SelectItem>
                      <SelectItem value="1">Ativo</SelectItem>
                      <SelectItem value="2">Cancelado</SelectItem>
                      <SelectItem value="3">Finalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              </div>
            </div>
            <DataTable
              data={filteredOrders}
              type="orders"
              withPagination
              itemsPerPage={20}
            />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
