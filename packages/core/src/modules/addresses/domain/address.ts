export type Address = {
  id: string
  userId: string
  recipientName: string
  street: string
  number: string
  complement: string | null
  city: string
  neighborhood: string
  zipCode: string
  country: string
  phone: string
  email: string
  cpfOrCnpj: string
  createdAt: Date
}

export type CreateAddressInput = Omit<
  Address,
  "id" | "createdAt" | "complement"
> & {
  complement?: string
}

export type UpdateAddressInput = {
  id: string
  userId: string
  data: Partial<
    Omit<CreateAddressInput, "userId" | "complement"> & {
      complement: string | null
    }
  >
}

export class AddressNotFoundError extends Error {
  constructor() {
    super("Endereço não encontrado.")
  }
}
