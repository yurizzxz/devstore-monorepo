import type { CartPrice } from "../domain/cart";

export type Cart = {
  id: string;
  userId: string;
  totalInCents: number;
};

export type CartItem = {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
};

export type ProductForCart = CartPrice & {
  id: string;
  stockQuantity: number;
};

export type CartItemForPricing = CartPrice & {
  id: string;
  productId: string;
  quantity: number;
};

export interface CartRepository {
  findCartByUserId(userId: string): Promise<Cart | null>;
  createCart(userId: string): Promise<Cart>;
  findCartItem(cartId: string, productId: string): Promise<CartItem | null>;
  createCartItem(input: {
    cartId: string;
    productId: string;
    quantity: number;
  }): Promise<CartItem>;
  updateCartItemQuantity(input: {
    cartItemId: string;
    quantity: number;
  }): Promise<CartItem>;
  deleteCartItem(cartItemId: string): Promise<void>;
  findProductForCart(
    productId: string,
    now: Date,
  ): Promise<ProductForCart | null>;
  findCartItemsForPricing(
    cartId: string,
    now: Date,
  ): Promise<CartItemForPricing[]>;
  updateCartTotal(cartId: string, totalInCents: number): Promise<void>;
}
