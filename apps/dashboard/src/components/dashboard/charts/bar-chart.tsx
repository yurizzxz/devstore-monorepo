"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { useCategoriasMaisVendidas } from "@/hooks/useBestCategories"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  desktop: {
    label: "Total Vendido",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function ChartBarInteractive() {
  const { categorias } = useCategoriasMaisVendidas()

  const chartData = categorias.map((categoria: any) => ({
    month: categoria.categoria_nome,
    desktop: categoria.total_vendido,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg -mb-1">Categorias Mais Vendidas</CardTitle>
        <CardDescription>Visualize as categorias mais vendidas com base nos pedidos!</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-primary)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Crescendo 5.2% este mês <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Exibindo categorias mais vendidas em pedidos finalizados
        </div>
      </CardFooter>
    </Card>
  )
}
