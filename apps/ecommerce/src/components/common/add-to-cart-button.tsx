"use client";

import { addProductToCart } from "@/actions/cart";
import { Button } from "@repo/ui/components/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

type AddToCartButtonProps = {
  productId: string;
  disabled?: boolean;
};

export function AddToCartButton({
  productId,
  disabled = false,
}: AddToCartButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  function handleAddToCart() {
    startTransition(async () => {
      const result = await addProductToCart({ productId });

      if (!result.data?.success) {
        toast.error(
          result.serverError ?? "Não foi possível atualizar o carrinho.",
        );
        return;
      }

      toast.success("Produto adicionado ao carrinho.");
      router.refresh();
    });
  }

  return (
    <div className="mt-6 space-y-2">
      <Button
        className="h-13 w-full text-base font-bold"
        disabled={disabled || isPending}
        onClick={handleAddToCart}
        type="button"
      >
        {isPending ? "Adicionando..." : "Adicionar ao carrinho"}
      </Button>
    </div>
  );
}
