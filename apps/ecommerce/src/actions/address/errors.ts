import { AddressNotFoundError } from "@repo/core/modules/addresses/domain/address"

export function getAddressErrorMessage(error: unknown) {
  if (error instanceof AddressNotFoundError) {
    return "Endereço não encontrado."
  }

  return "Não foi possível cadastrar o endereço."
}

export function getUpdateAddressErrorMessage(error: unknown) {
  if (error instanceof AddressNotFoundError) {
    return "Endereço não encontrado."
  }

  return "Não foi possível atualizar o endereço."
}

export function getRemoveAddressErrorMessage(error: unknown) {
  if (error instanceof AddressNotFoundError) {
    return "Endereço não encontrado."
  }

  return "Não foi possível remover o endereço."
}
