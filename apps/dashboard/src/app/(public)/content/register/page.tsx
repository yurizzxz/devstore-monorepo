import { Button } from "@/components/ui/buttonUi";
import {HeadingTitle} from "@/components/ui/heading";
import Link from "next/link";

import { SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";
import { RegisterForm } from "./form";

export default function Page() {
  return (
    <SidebarInset>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex px-4 lg:px-6 flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center justify-between">
              <HeadingTitle>Cadastrar Seção</HeadingTitle>
              <Link href="/content">
                <Button>Ver Lista</Button>
              </Link>
            </div>
            <RegisterForm />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
