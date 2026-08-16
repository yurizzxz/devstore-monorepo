"use client";

import { addProductToCart } from "@/actions/cart";
import { Button } from "@repo/ui/components/button";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

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
  const [message, setMessage] = useState("");

  function handleAddToCart() {
    setMessage("");

    startTransition(async () => {
      const result = await addProductToCart({ productId });

      if (!result.data?.success) {
        setMessage(result.serverError ?? "Não foi possível atualizar o carrinho.");
        return;
      }

      setMessage("Produto adicionado ao carrinho.");
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
      {message && (
        <p className="text-center text-sm text-zinc-300" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
