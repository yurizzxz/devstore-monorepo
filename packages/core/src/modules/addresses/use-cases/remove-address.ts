import { AddressNotFoundError } from "../domain/address"
import type { AddressRepository } from "../repositories/address-repository"

type RemoveAddressInput = {
  id: string
  userId: string
}

export class RemoveAddress {
  constructor(private readonly addressRepository: AddressRepository) {}

  async execute({ id, userId }: RemoveAddressInput) {
    const removed = await this.addressRepository.remove(id, userId)

    if (!removed) throw new AddressNotFoundError()
  }
}
