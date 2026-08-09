export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const formatCentsToBRL = (cents: number): string => {
  const valueInReais = cents / 100;
  return formatCurrency(valueInReais);
};
