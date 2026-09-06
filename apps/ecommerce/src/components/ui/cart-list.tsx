"use client"

import {
  removeProductFromCart,
  updateCartItemQuantity,
} from "@/actions/cart"
import { formatCentsToBRL } from "@repo/utils/money"
import { Button } from "@repo/ui/components/button"
import { Separator } from "@repo/ui/components/separator"
import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

export type CartView = {
  id: string
  totalInCents: number
  items: Array<{
    id: string
    productId: string
    quantity: number
    product: {
      name: string
      slug: string
      productImage: string
      stockQuantity: number
      priceInCents: number
    }
  }>
}

type CartListProps = {
  cart: CartView | null
}

export default function CartList({ cart }: CartListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const items = cart?.items ?? []

  function runCartAction(
    action: () => Promise<{
      data?: { success: boolean }
      serverError?: string
    }>,
    successMessage: string,
  ) {
    startTransition(async () => {
      const result = await action()

      if (!result.data?.success) {
        toast.error(
          result.serverError ?? "Não foi possível atualizar o carrinho.",
        )
        return
      }

      toast.success(successMessage)
      router.refresh()
    })
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col">
      <div className="flex-1 overflow-y-auto px-4">
        {items.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-400">
            Nenhum item adicionado no carrinho.
          </p>
        ) : (
          <ul>
            {items.map((item) => (
              <li
                className="flex gap-3 border-b border-zinc-800 py-4"
                key={item.id}
              >
                <Link className="shrink-0" href={`/product/${item.product.slug}`}>
                  <Image
                    alt={item.product.name}
                    className="size-20 rounded-md object-contain"
                    height={80}
                    src={item.product.productImage}
                    width={80}
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <Link
                    className="line-clamp-2 text-sm font-semibold hover:text-primary"
                    href={`/product/${item.product.slug}`}
                  >
                    {item.product.name}
                  </Link>
                  <p className="mt-1 text-base font-bold text-primary">
                    {formatCentsToBRL(item.product.priceInCents)}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center rounded-md border border-zinc-700">
                      <Button
                        aria-label={`Diminuir quantidade de ${item.product.name}`}
                        disabled={isPending}
                        onClick={() => {
                          if (item.quantity === 1) {
                            runCartAction(() =>
                              removeProductFromCart({ productId: item.productId }),
                              "Produto removido do carrinho.",
                            )
                            return
                          }

                          runCartAction(() =>
                            updateCartItemQuantity({
                              productId: item.productId,
                              quantity: item.quantity - 1,
                            }),
                            "Quantidade atualizada.",
                          )
                        }}
                        size="icon-xs"
                        type="button"
                        variant="ghost"
                      >
                        <Minus />
                      </Button>
                      <span className="min-w-8 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <Button
                        aria-label={`Aumentar quantidade de ${item.product.name}`}
                        disabled={isPending || item.quantity >= item.product.stockQuantity}
                        onClick={() =>
                          runCartAction(() =>
                            updateCartItemQuantity({
                              productId: item.productId,
                              quantity: item.quantity + 1,
                            }),
                            "Quantidade atualizada.",
                          )
                        }
                        size="icon-xs"
                        type="button"
                        variant="ghost"
                      >
                        <Plus />
                      </Button>
                    </div>

                    <Button
                      aria-label={`Remover ${item.product.name} do carrinho`}
                      disabled={isPending}
                      onClick={() =>
                        runCartAction(() =>
                          removeProductFromCart({ productId: item.productId }),
                          "Produto removido do carrinho.",
                        )
                      }
                      size="icon-xs"
                      type="button"
                      variant="ghost"
                    >
                      <Trash2 className="text-red-400" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Separator />

      <div className="space-y-4 px-5 py-4">
        <div className="flex items-center justify-between text-base font-semibold">
          <span>Subtotal</span>
          <span>{formatCentsToBRL(cart?.totalInCents ?? 0)}</span>
        </div>
        <Button
          className="w-full"
          disabled={items.length === 0}
          onClick={() => router.push("/checkout")}
          type="button"
        >
          Finalizar compra
        </Button>
      </div>
    </div>
  )
}
