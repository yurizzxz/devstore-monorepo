import { PendingOrderNotFoundError } from "../domain/order"
import type { OrderRepository } from "../repositories/order-repository"

export class CancelOrder {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(orderId: string) {
    const cancelled = await this.orderRepository.cancel(orderId)

    if (!cancelled) throw new PendingOrderNotFoundError()
  }
}
