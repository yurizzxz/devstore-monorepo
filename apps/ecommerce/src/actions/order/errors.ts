import {
  CartChangedDuringCheckoutError,
  EmptyCartError,
  OrderProductOutOfStockError,
  OrderShippingAddressNotFoundError,
} from "@repo/core/modules/orders/domain/order";

export function getCreateOrderErrorMessage(error: unknown) {
  if (error instanceof EmptyCartError) return "O carrinho está vazio.";
  if (error instanceof CartChangedDuringCheckoutError) {
    return "O carrinho mudou. Revise os itens e tente novamente.";
  }
  if (error instanceof OrderShippingAddressNotFoundError) {
    return "Endereço de entrega não encontrado.";
  }
  if (error instanceof OrderProductOutOfStockError) {
    return "Um ou mais produtos estão sem estoque suficiente.";
  }

  return "Não foi possível criar o pedido.";
}
