import type { Order } from "../domain/order"

export type CreateOrderFromCartInput = {
  userId: string
  shippingAddressId: string
  now: Date
}

export type SetCheckoutSessionInput = {
  orderId: string
  checkoutSessionId: string
}

export type ConfirmOrderPaymentInput = SetCheckoutSessionInput & {
  paymentIntentId?: string
}

export interface OrderRepository {
  createFromCart(input: CreateOrderFromCartInput): Promise<Order>
  setCheckoutSessionId(input: SetCheckoutSessionInput): Promise<boolean>
  confirmPayment(input: ConfirmOrderPaymentInput): Promise<boolean>
  cancel(orderId: string): Promise<boolean>
}
