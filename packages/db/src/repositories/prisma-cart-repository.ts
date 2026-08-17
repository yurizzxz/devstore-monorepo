import type {
  Cart,
  CartItem,
  CartItemForPricing,
  CartRepository,
  ProductForCart,
} from "@repo/core/modules/cart/repositories/cart-repository"
import { prisma } from "@repo/prisma/client"

const productPriceSelect = (now: Date) => ({
  id: true,
  stockQuantity: true,
  priceInCents: true,
  promotions: {
    where: {
      promotion: {
        isActive: true,
        startsAt: { lte: now },
        endsAt: { gte: now },
      },
    },
    select: { promotionPriceInCents: true },
  },
})

export class PrismaCartRepository implements CartRepository {
  async findCartByUserId(userId: string): Promise<Cart | null> {
    return prisma.cart.findUnique({
      where: { userId },
      select: { id: true, userId: true, totalInCents: true },
    })
  }

  async createCart(userId: string): Promise<Cart> {
    return prisma.cart.create({
      data: { userId, totalInCents: 0 },
      select: { id: true, userId: true, totalInCents: true },
    })
  }

  async findCartItem(cartId: string, productId: string): Promise<CartItem | null> {
    return prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId, productId } },
      select: { id: true, cartId: true, productId: true, quantity: true },
    })
  }

  async createCartItem(input: {
    cartId: string
    productId: string
    quantity: number
  }): Promise<CartItem> {
    return prisma.cartItem.create({
      data: input,
      select: { id: true, cartId: true, productId: true, quantity: true },
    })
  }

  async updateCartItemQuantity(input: {
    cartItemId: string
    quantity: number
  }): Promise<CartItem> {
    return prisma.cartItem.update({
      where: { id: input.cartItemId },
      data: { quantity: input.quantity },
      select: { id: true, cartId: true, productId: true, quantity: true },
    })
  }

  async deleteCartItem(cartItemId: string): Promise<void> {
    await prisma.cartItem.delete({ where: { id: cartItemId } })
  }

  async findProductForCart(productId: string, now: Date): Promise<ProductForCart | null> {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: productPriceSelect(now),
    })

    if (!product) return null

    return {
      id: product.id,
      stockQuantity: product.stockQuantity,
      basePriceInCents: product.priceInCents,
      promotionPricesInCents: product.promotions.map(
        (promotion) => promotion.promotionPriceInCents,
      ),
    }
  }

  async findCartItemsForPricing(
    cartId: string,
    now: Date,
  ): Promise<CartItemForPricing[]> {
    const items = await prisma.cartItem.findMany({
      where: { cartId },
      select: {
        id: true,
        productId: true,
        quantity: true,
        product: { select: productPriceSelect(now) },
      },
    })

    return items.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      basePriceInCents: item.product.priceInCents,
      promotionPricesInCents: item.product.promotions.map(
        (promotion) => promotion.promotionPriceInCents,
      ),
    }))
  }

  async updateCartTotal(cartId: string, totalInCents: number): Promise<void> {
    await prisma.cart.update({
      where: { id: cartId },
      data: { totalInCents },
    })
  }
}
