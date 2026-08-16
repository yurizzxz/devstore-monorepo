import {
  CartItemNotFoundError,
  InsufficientProductStockError,
  InvalidCartQuantityError,
  ProductNotFoundError,
  ProductOutOfStockError,
} from "@repo/core/modules/cart/domain/cart";

export function getCartErrorMessage(error: unknown) {
  if (error instanceof ProductNotFoundError) return "Produto não encontrado.";
  if (error instanceof ProductOutOfStockError) return "Produto sem estoque.";
  if (error instanceof InsufficientProductStockError) {
    return "A quantidade solicitada não está disponível.";
  }
  if (error instanceof InvalidCartQuantityError) return "Quantidade inválida.";
  if (error instanceof CartItemNotFoundError) {
    return "Item não encontrado no carrinho.";
  }

  return "Não foi possível atualizar o carrinho.";
}
