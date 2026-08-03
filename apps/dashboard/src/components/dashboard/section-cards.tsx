import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFaturamentoTotal } from "@/hooks/useFaturamento";
import { formatCurrency } from "@/utils/formatCurrency";
import { useFinishedOrders } from "@/hooks/useFinishedOrders";
import { useTotalUsers } from "@/hooks/useTotalUsers";

export function SectionCards() {
  const { total } = useFaturamentoTotal();
  const { totalUsers } = useTotalUsers();
  const { finishedOrders } = useFinishedOrders();
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-sidebar grid grid-cols-1 gap-3.5 *:data-[slot=card]:bg-sidebar *:data-[slot=card]:shadow-xs @xl/main:grid-cols-3  @5xl/main:grid-cols-3">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Faturamento Total</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(total)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex items-start gap-2 font-medium leading-none">
            Dados atualizados <IconTrendingUp className="h-4 w-4" />
          </div>
          <div className="flex items-start gap-2 leading-none text-muted-foreground">
            Baseado nos pedidos mais recentes
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total de Usuários</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalUsers}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex items-start gap-2 font-medium leading-none">
            Dados atualizados <IconTrendingUp className="h-4 w-4" />
          </div>
          <div className="flex items-start gap-2 leading-none text-muted-foreground">
            Baseado nos dados mais recentes
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pedidos Finalizados</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {finishedOrders}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Dados Atualizados <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
          Baseado nos dados mais recentes
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
