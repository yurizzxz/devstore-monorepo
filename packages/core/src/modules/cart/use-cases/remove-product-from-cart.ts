import {
  calculateCartTotalInCents,
  CartItemNotFoundError,
} from "../domain/cart"
import type { CartRepository } from "../repositories/cart-repository"

type RemoveProductFromCartInput = {
  userId: string
  productId: string
}

export class RemoveProductFromCart {
  constructor(private readonly cartRepository: CartRepository) {}

  async execute({ userId, productId }: RemoveProductFromCartInput) {
    const cart = await this.cartRepository.findCartByUserId(userId)
    if (!cart) throw new CartItemNotFoundError()

    const item = await this.cartRepository.findCartItem(cart.id, productId)
    if (!item) throw new CartItemNotFoundError()

    await this.cartRepository.deleteCartItem(item.id)

    const items = await this.cartRepository.findCartItemsForPricing(cart.id, new Date())
    const totalInCents = calculateCartTotalInCents(items)
    await this.cartRepository.updateCartTotal(cart.id, totalInCents)

    return { cartId: cart.id, totalInCents }
  }
}
