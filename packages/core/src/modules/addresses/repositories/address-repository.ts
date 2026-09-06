import type {
  Address,
  CreateAddressInput,
  UpdateAddressInput,
} from "../domain/address"

export interface AddressRepository {
  create(input: CreateAddressInput): Promise<Address>
  findManyByUserId(userId: string): Promise<Address[]>
  update(input: UpdateAddressInput): Promise<Address | null>
  remove(id: string, userId: string): Promise<boolean>
}
