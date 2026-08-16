import {
  assertValidQuantity,
  calculateCartTotalInCents,
  InsufficientProductStockError,
  ProductNotFoundError,
  ProductOutOfStockError,
} from "../domain/cart"
import type { CartRepository } from "../repositories/cart-repository"

type AddProductToCartInput = {
  userId: string
  productId: string
  quantity?: number
}

export class AddProductToCart {
  constructor(private readonly cartRepository: CartRepository) {}

  async execute({ userId, productId, quantity = 1 }: AddProductToCartInput) {
    assertValidQuantity(quantity)

    const now = new Date()
    const product = await this.cartRepository.findProductForCart(productId, now)

    if (!product) throw new ProductNotFoundError()
    if (product.stockQuantity <= 0) throw new ProductOutOfStockError()

    const cart =
      (await this.cartRepository.findCartByUserId(userId)) ??
      (await this.cartRepository.createCart(userId))

    const existingItem = await this.cartRepository.findCartItem(cart.id, productId)
    const nextQuantity = (existingItem?.quantity ?? 0) + quantity

    if (nextQuantity > product.stockQuantity) {
      throw new InsufficientProductStockError()
    }

    if (existingItem) {
      await this.cartRepository.updateCartItemQuantity({
        cartItemId: existingItem.id,
        quantity: nextQuantity,
      })
    } else {
      await this.cartRepository.createCartItem({
        cartId: cart.id,
        productId,
        quantity,
      })
    }

    const items = await this.cartRepository.findCartItemsForPricing(cart.id, now)
    const totalInCents = calculateCartTotalInCents(items)
    await this.cartRepository.updateCartTotal(cart.id, totalInCents)

    return { cartId: cart.id, totalInCents }
  }
}
