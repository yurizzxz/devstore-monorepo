import type { Order } from "../domain/order"

export type CreateOrderFromCartInput = {
  userId: string
  shippingAddressId: string
  now: Date
}

export interface OrderRepository {
  createFromCart(input: CreateOrderFromCartInput): Promise<Order>
  confirmPayment(orderId: string): Promise<boolean>
  cancel(orderId: string): Promise<boolean>
}
