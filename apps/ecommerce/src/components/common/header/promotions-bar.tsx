"use client";
import { BadgePercent, Truck, Lock } from "lucide-react";

export const PromotionsBar = () => {
  return (
    <div className="bg-primary">
      <div className="p-1 hidden lg:flex justify-between items-center w-full max-w-6xl mx-auto">
        <div className="flex items-center gap-2 font-semibold">
          <Lock className="size-4" />
          <p className="text-sm">Compras 100% seguras</p>
        </div>
        <div className="flex items-center gap-2 font-semibold">
          <Truck className="size-5" />
          <p className="text-sm">Frete Grátis para todo o Brasil</p>
        </div>
        <div className="flex items-center gap-2 font-semibold">
          <BadgePercent className="size-5" />
          <p className="text-sm">20% de desconto na primeira compra</p>
        </div>
      </div>

      <div className="p-1 lg:hidden flex items-center justify-center">
        <div className="flex items-center gap-2 font-semibold">
          <Lock className="size-4" />
          <p className="text-sm">Compras 100% seguras</p>
        </div>
      </div>
    </div>
  );
}
