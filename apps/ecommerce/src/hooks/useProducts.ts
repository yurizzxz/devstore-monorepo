export interface Product {
  id: number;
  nome: string;
  description: string;
  price: number;
  image: string;
  category: number;
  specifications: string;
  category2: number;
}

export function useFilteredProducts(categoryId?: string) {
  return [];
}
