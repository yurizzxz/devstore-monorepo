import type { CreateAddressInput } from "../domain/address"
import type { AddressRepository } from "../repositories/address-repository"

export class CreateAddress {
  constructor(private readonly addressRepository: AddressRepository) {}

  execute(input: CreateAddressInput) {
    return this.addressRepository.create(input)
  }
}
