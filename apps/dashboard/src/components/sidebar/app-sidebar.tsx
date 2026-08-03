"use client"

import * as React from "react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {  navMain, navSecondary } from "@/data/links"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="p-1.5  mt-3">
              <Link href="/" className="inset" aria-label="Clique para ir à Página Inicial">
                <Image src="/logo1.png" alt="Logo DevStore" width={130} height={32} />
              </Link>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator className="mt-1 mb- opacity-0" />
      <SidebarContent>
        <NavMain items={navMain} pathname={pathname} />
        <NavSecondary items={navSecondary} className="mt-auto hidden" />
      </SidebarContent>
      <SidebarSeparator className="-ml-[0.5px] opacity-0" />
      <SidebarFooter>
      <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
