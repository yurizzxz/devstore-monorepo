import type { OrderRepository } from "../repositories/order-repository";

type CreateOrderInput = {
  userId: string;
  shippingAddressId: string;
};

export class CreateOrder {
  constructor(private readonly orderRepository: OrderRepository) {}

  execute(input: CreateOrderInput) {
    return this.orderRepository.createFromCart({
      ...input,
      now: new Date(),
    });
  }
}
