import { PendingOrderNotFoundError } from "../domain/order"
import type {
  ConfirmOrderPaymentInput,
  OrderRepository,
} from "../repositories/order-repository"

export class ConfirmOrderPayment {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(input: ConfirmOrderPaymentInput) {
    const confirmed = await this.orderRepository.confirmPayment(input)

    if (!confirmed) throw new PendingOrderNotFoundError()
  }
}
