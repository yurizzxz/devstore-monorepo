"use client";

import { TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { usePedidosPorStatus } from "@/hooks/useOrderStatus";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getStatsName } from "@/utils/mappers";

const chartConfig = {
  desktop: {
    label: "Pedidos",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function ChartRadarInteractive() {
  const { pedidos } = usePedidosPorStatus();

  const chartData = pedidos.map((pedido: any) => ({
    month: getStatsName(pedido.status),
    desktop: pedido.total,
  }));

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle className="text-lg -mb-1">Pedidos</CardTitle>
        <CardDescription>Acompanhe a distribuição dos pedidos!</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="mx-auto max-h-[275px]">
          <RadarChart data={chartData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarGrid className="fill-[--color-primary] opacity-20" />
            <PolarAngleAxis dataKey="month" />
            <Radar
              dataKey="desktop"
              fill="var(--color-primary)"
              fillOpacity={0.5}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-start gap-2 font-medium leading-none">
          Dados atualizados <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-start gap-2 leading-none text-muted-foreground">
          Baseado nos pedidos mais recentes
        </div>
      </CardFooter>
    </Card>
  );
}
