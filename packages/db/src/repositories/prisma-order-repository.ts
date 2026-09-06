import {
  calculateOrderTotalInCents,
  CartChangedDuringCheckoutError,
  EmptyCartError,
  getOrderExpirationDate,
  getOrderItemPriceInCents,
  type Order,
  OrderProductOutOfStockError,
  OrderShippingAddressNotFoundError,
} from "@repo/core/modules/orders/domain/order"
import type {
  ConfirmOrderPaymentInput,
  CreateOrderFromCartInput,
  OrderRepository,
  SetCheckoutSessionInput,
} from "@repo/core/modules/orders/repositories/order-repository"
import { prisma } from "@repo/prisma/client"

const orderSelect = {
  id: true,
  userId: true,
  shippingAddressId: true,
  status: true,
  email: true,
  totalPriceInCents: true,
  expiresAt: true,
  createdAt: true,
  items: {
    select: {
      productId: true,
      quantity: true,
      priceInCents: true,
      product: { select: { name: true } },
    },
  },
}

export class PrismaOrderRepository implements OrderRepository {
  createFromCart(input: CreateOrderFromCartInput): Promise<Order> {
    return prisma.$transaction(async (transaction) => {
      const address = await transaction.shippingAddress.findFirst({
        where: {
          id: input.shippingAddressId,
          userId: input.userId,
        },
      })

      if (!address) throw new OrderShippingAddressNotFoundError()

      const cart = await transaction.cart.findFirst({
        where: { userId: input.userId },
        select: {
          id: true,
          updatedAt: true,
          items: {
            select: {
              productId: true,
              quantity: true,
              product: {
                select: {
                  priceInCents: true,
                  promotions: {
                    where: {
                      promotion: {
                        isActive: true,
                        startsAt: { lte: input.now },
                        endsAt: { gte: input.now },
                      },
                    },
                    select: { promotionPriceInCents: true },
                  },
                },
              },
            },
          },
        },
      })

      if (!cart || cart.items.length === 0) throw new EmptyCartError()

      const cartClaim = await transaction.cart.updateMany({
        where: {
          id: cart.id,
          userId: input.userId,
          updatedAt: cart.updatedAt,
        },
        data: { updatedAt: input.now },
      })

      if (cartClaim.count === 0) {
        throw new CartChangedDuringCheckoutError()
      }

      const pricedItems = cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        basePriceInCents: item.product.priceInCents,
        promotionPricesInCents: item.product.promotions.map(
          (promotion) => promotion.promotionPriceInCents,
        ),
      }))

      for (const item of pricedItems) {
        const stockUpdate = await transaction.product.updateMany({
          where: {
            id: item.productId,
            stockQuantity: { gte: item.quantity },
          },
          data: {
            stockQuantity: { decrement: item.quantity },
          },
        })

        if (stockUpdate.count === 0) {
          throw new OrderProductOutOfStockError()
        }
      }

      const order = await transaction.order.create({
        data: {
          userId: input.userId,
          shippingAddressId: address.id,
          recipientName: address.recipientName,
          street: address.street,
          number: address.number,
          complement: address.complement,
          city: address.city,
          neighborhood: address.neighborhood,
          zipCode: address.zipCode,
          country: address.country,
          phone: address.phone,
          email: address.email,
          cpfOrCnpj: address.cpfOrCnpj,
          totalPriceInCents: calculateOrderTotalInCents(pricedItems),
          expiresAt: getOrderExpirationDate(input.now),
          items: {
            create: pricedItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceInCents: getOrderItemPriceInCents(item),
            })),
          },
        },
        select: orderSelect,
      })

      await transaction.cartItem.deleteMany({
        where: { cartId: cart.id },
      })

      await transaction.cart.updateMany({
        where: { id: cart.id, userId: input.userId },
        data: { totalInCents: 0 },
      })

      return {
        ...order,
        items: order.items.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          quantity: item.quantity,
          priceInCents: item.priceInCents,
        })),
      }
    })
  }

  async setCheckoutSessionId(
    input: SetCheckoutSessionInput,
  ): Promise<boolean> {
    const result = await prisma.order.updateMany({
      where: {
        id: input.orderId,
        status: "PENDING_PAYMENT",
        stripeCheckoutSessionId: null,
      },
      data: { stripeCheckoutSessionId: input.checkoutSessionId },
    })

    return result.count > 0
  }

  async confirmPayment(input: ConfirmOrderPaymentInput): Promise<boolean> {
    const result = await prisma.order.updateMany({
      where: {
        id: input.orderId,
        stripeCheckoutSessionId: input.checkoutSessionId,
        status: "PENDING_PAYMENT",
      },
      data: {
        status: "SUCCESS_PAYMENT",
        stripePaymentIntentId: input.paymentIntentId,
      },
    })

    if (result.count > 0) return true

    const confirmedOrder = await prisma.order.findFirst({
      where: {
        id: input.orderId,
        stripeCheckoutSessionId: input.checkoutSessionId,
        status: "SUCCESS_PAYMENT",
      },
      select: { id: true },
    })

    return confirmedOrder !== null
  }

  cancel(orderId: string): Promise<boolean> {
    return prisma.$transaction(async (transaction) => {
      const order = await transaction.order.findUnique({
        where: { id: orderId },
        select: {
          status: true,
          items: {
            select: {
              productId: true,
              quantity: true,
            },
          },
        },
      })

      if (!order) return false
      if (order.status === "CANCELLED") return true
      if (order.status === "SUCCESS_PAYMENT") return false

      const statusUpdate = await transaction.order.updateMany({
        where: {
          id: orderId,
          status: "PENDING_PAYMENT",
        },
        data: { status: "CANCELLED" },
      })

      if (statusUpdate.count === 0) return false

      for (const item of order.items) {
        await transaction.product.updateMany({
          where: { id: item.productId },
          data: {
            stockQuantity: { increment: item.quantity },
          },
        })
      }

      return true
    })
  }
}
