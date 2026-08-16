export type CartPrice = {
  basePriceInCents: number;
  promotionPricesInCents: number[];
};

export type CartPricedItem = CartPrice & {
  quantity: number;
};

export function getCurrentPriceInCents({
  basePriceInCents,
  promotionPricesInCents,
}: CartPrice) {
  return Math.min(basePriceInCents, ...promotionPricesInCents);
}

export function calculateCartTotalInCents(items: CartPricedItem[]) {
  return items.reduce(
    (total, item) => total + getCurrentPriceInCents(item) * item.quantity,
    0,
  );
}

export function assertValidQuantity(quantity: number) {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new InvalidCartQuantityError();
  }
}

export class InvalidCartQuantityError extends Error {
  constructor() {
    super("A quantidade deve ser um número inteiro maior que zero.");
  }
}

export class ProductNotFoundError extends Error {
  constructor() {
    super("Produto não encontrado.");
  }
}

export class ProductOutOfStockError extends Error {
  constructor() {
    super("Produto sem estoque.");
  }
}

export class InsufficientProductStockError extends Error {
  constructor() {
    super("Quantidade indisponível em estoque.");
  }
}

export class CartItemNotFoundError extends Error {
  constructor() {
    super("Item não encontrado no carrinho.");
  }
}
