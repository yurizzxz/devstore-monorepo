"use client";
import { SectionCards } from "@/components/dashboard/section-cards";
import { SiteHeader } from "@/components/dashboard/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { HeadingTitle } from "@/components/ui/heading";
import { ChartBarInteractive } from "@/components/dashboard/charts/bar-chart";
import { ChartLineInteractive } from "@/components/dashboard/charts/line-chart";
import { ChartRadarInteractive } from "@/components/dashboard/charts/radar-chart";


export default function Dashboard() {

  return (
    <SidebarInset>
      <SiteHeader />

      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex px-4 lg:px-6 flex-col gap-4 py-4 md:gap-6 md:py-6">
            <HeadingTitle>Hi, Welcome Back! 👋</HeadingTitle>
            <SectionCards />
              <ChartLineInteractive />
            <div className="grid xl:grid-cols-2 gap-4">
              <ChartBarInteractive />

              <ChartRadarInteractive />
            </div>
          
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
