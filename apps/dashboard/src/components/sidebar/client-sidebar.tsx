"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "./app-sidebar";

const ClientSidebar = () => {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  return <AppSidebar variant="inset" />;
};

export default ClientSidebar;
