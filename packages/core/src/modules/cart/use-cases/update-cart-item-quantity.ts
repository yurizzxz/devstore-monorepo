import {
  assertValidQuantity,
  calculateCartTotalInCents,
  CartItemNotFoundError,
  InsufficientProductStockError,
  ProductNotFoundError,
  ProductOutOfStockError,
} from "../domain/cart"
import type { CartRepository } from "../repositories/cart-repository"

type UpdateCartItemQuantityInput = {
  userId: string
  productId: string
  quantity: number
}

export class UpdateCartItemQuantity {
  constructor(private readonly cartRepository: CartRepository) {}

  async execute({ userId, productId, quantity }: UpdateCartItemQuantityInput) {
    assertValidQuantity(quantity)

    const now = new Date()
    const cart = await this.cartRepository.findCartByUserId(userId)
    if (!cart) throw new CartItemNotFoundError()

    const item = await this.cartRepository.findCartItem(cart.id, productId)
    if (!item) throw new CartItemNotFoundError()

    const product = await this.cartRepository.findProductForCart(productId, now)
    if (!product) throw new ProductNotFoundError()
    if (product.stockQuantity <= 0) throw new ProductOutOfStockError()
    if (quantity > product.stockQuantity) throw new InsufficientProductStockError()

    await this.cartRepository.updateCartItemQuantity({
      cartItemId: item.id,
      quantity,
    })

    const items = await this.cartRepository.findCartItemsForPricing(cart.id, now)
    const totalInCents = calculateCartTotalInCents(items)
    await this.cartRepository.updateCartTotal(cart.id, totalInCents)

    return { cartId: cart.id, totalInCents }
  }
}
