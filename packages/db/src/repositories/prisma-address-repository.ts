import type {
  Address,
  CreateAddressInput,
  UpdateAddressInput,
} from "@repo/core/modules/addresses/domain/address"
import type { AddressRepository } from "@repo/core/modules/addresses/repositories/address-repository"
import { prisma } from "@repo/prisma/client"

const addressSelect = {
  id: true,
  userId: true,
  recipientName: true,
  street: true,
  number: true,
  complement: true,
  city: true,
  neighborhood: true,
  zipCode: true,
  country: true,
  phone: true,
  email: true,
  cpfOrCnpj: true,
  createdAt: true,
}

export class PrismaAddressRepository implements AddressRepository {
  create(input: CreateAddressInput): Promise<Address> {
    return prisma.shippingAddress.create({
      data: input,
      select: addressSelect,
    })
  }

  findManyByUserId(userId: string): Promise<Address[]> {
    return prisma.shippingAddress.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: addressSelect,
    })
  }

  async update(input: UpdateAddressInput): Promise<Address | null> {
    const result = await prisma.shippingAddress.updateMany({
      where: { id: input.id, userId: input.userId },
      data: input.data,
    })

    if (result.count === 0) return null

    return prisma.shippingAddress.findUnique({
      where: { id: input.id },
      select: addressSelect,
    })
  }

  async remove(id: string, userId: string): Promise<boolean> {
    const result = await prisma.shippingAddress.deleteMany({
      where: { id, userId },
    })

    return result.count > 0
  }
}
