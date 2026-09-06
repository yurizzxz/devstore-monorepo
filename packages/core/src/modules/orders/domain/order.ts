export const ORDER_EXPIRATION_IN_MINUTES = 35

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "SUCCESS_PAYMENT"
  | "CANCELLED"

export type Order = {
  id: string
  userId: string
  shippingAddressId: string
  status: OrderStatus
  email: string
  totalPriceInCents: number
  expiresAt: Date
  createdAt: Date
  items: OrderItem[]
}

export type OrderItem = {
  productId: string
  productName: string
  quantity: number
  priceInCents: number
}

export type OrderPricedItem = {
  quantity: number
  basePriceInCents: number
  promotionPricesInCents: number[]
}

export function getOrderItemPriceInCents(item: OrderPricedItem) {
  return Math.min(item.basePriceInCents, ...item.promotionPricesInCents)
}

export function calculateOrderTotalInCents(items: OrderPricedItem[]) {
  return items.reduce(
    (total, item) => total + getOrderItemPriceInCents(item) * item.quantity,
    0,
  )
}

export function getOrderExpirationDate(now: Date) {
  return new Date(now.getTime() + ORDER_EXPIRATION_IN_MINUTES * 60_000)
}

export class EmptyCartError extends Error {
  constructor() {
    super("O carrinho está vazio.")
  }
}

export class CartChangedDuringCheckoutError extends Error {
  constructor() {
    super("O carrinho foi alterado durante a criação do pedido.")
  }
}

export class OrderShippingAddressNotFoundError extends Error {
  constructor() {
    super("Endereço de entrega não encontrado.")
  }
}

export class OrderProductOutOfStockError extends Error {
  constructor() {
    super("Um ou mais produtos estão sem estoque suficiente.")
  }
}

export class PendingOrderNotFoundError extends Error {
  constructor() {
    super("Pedido pendente não encontrado.")
  }
}
