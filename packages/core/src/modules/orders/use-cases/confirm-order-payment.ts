import { PendingOrderNotFoundError } from "../domain/order"
import type { OrderRepository } from "../repositories/order-repository"

export class ConfirmOrderPayment {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(orderId: string) {
    const confirmed = await this.orderRepository.confirmPayment(orderId)

    if (!confirmed) throw new PendingOrderNotFoundError()
  }
}
