"use client";
import { SiteHeader } from "@/components/dashboard/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import {HeadingTitle} from "@/components/ui/heading";
import { DataTable } from "@/components/table/data-table";
import { useSections } from "@/hooks/sections/useSection";
import { Button } from "@/components/ui/buttonUi";
import Link from "next/link";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState } from "react";

export default function Page() {
  const sections = useSections();

  {/*const [cargoFilter, setCargoFilter] = useState("all");

  const filteredSections = sections.filter((section) => {
    if (cargoFilter === "all") return true;
    return String(section.ativo).toLowerCase() === cargoFilter;
  });*/}

  return (
    <SidebarInset>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex px-4 lg:px-6 flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center justify-between">
              <HeadingTitle>Seções</HeadingTitle>
              <div className="flex items-center gap-4">
                {/*<div className="w-full max-w-xs">
                  <Select value={cargoFilter} onValueChange={setCargoFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="admin">Admins</SelectItem>
                      <SelectItem value="default">Default</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                */}
                <Link href="/content/register">
                  <Button>Adicionar Seção</Button>
                </Link>
              </div>
            </div>
            <DataTable
              data={sections}
              type="sections"
              withPagination
              itemsPerPage={20}
            />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
