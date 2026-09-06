import {
  AddressNotFoundError,
  type UpdateAddressInput,
} from "../domain/address"
import type { AddressRepository } from "../repositories/address-repository"

export class UpdateAddress {
  constructor(private readonly addressRepository: AddressRepository) {}

  async execute(input: UpdateAddressInput) {
    const address = await this.addressRepository.update(input)

    if (!address) throw new AddressNotFoundError()

    return address
  }
}
