import type { AddressRepository } from "../repositories/address-repository"

export class ListUserAddresses {
  constructor(private readonly addressRepository: AddressRepository) {}

  execute(userId: string) {
    return this.addressRepository.findManyByUserId(userId)
  }
}
