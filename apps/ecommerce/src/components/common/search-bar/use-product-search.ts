import { useEffect, useState } from "react";

export type ProductSearchResult = {
  id: string;
  name: string;
  slug: string;
  productImage: string;
  priceInCents: number;
  stockQuantity: number;
};

type ProductSearchResponse = {
  products: ProductSearchResult[];
  message?: string;
};

const MINIMUM_QUERY_LENGTH = 2;
const SEARCH_DEBOUNCE_IN_MS = 300;

export function useProductSearch(query: string) {
  const [products, setProducts] = useState<ProductSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const normalizedQuery = query.trim();
  const canSearch = normalizedQuery.length >= MINIMUM_QUERY_LENGTH;

  useEffect(() => {
    if (!canSearch) {
      setProducts([]);
      setErrorMessage(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    setProducts([]);
    setErrorMessage(null);
    setIsLoading(true);

    const timeout = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/products/search?q=${encodeURIComponent(normalizedQuery)}`,
          {
            signal: controller.signal,
          },
        );

        const data = (await response.json()) as ProductSearchResponse;

        if (!response.ok) {
          throw new Error(
            data.message ?? "Não foi possível pesquisar produtos.",
          );
        }

        setProducts(data.products);
      } catch (error) {
        if (controller.signal.aborted) return;

        setProducts([]);

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Não foi possível pesquisar produtos.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, SEARCH_DEBOUNCE_IN_MS);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [canSearch, normalizedQuery]);

  return {
    products,
    isLoading,
    errorMessage,
    normalizedQuery,
    canSearch,
  };
}