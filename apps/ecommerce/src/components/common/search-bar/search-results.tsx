import { formatCentsToBRL } from "@repo/utils/money";
import Image from "next/image";

import type { ProductSearchResult } from "./use-product-search";

import { SearchResultsSkeleton } from "./search-results-skeleton";

type SearchResultsProps = {
  id: string;
  products: ProductSearchResult[];
  normalizedQuery: string;
  isLoading: boolean;
  errorMessage: string | null;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onSelect: (product: ProductSearchResult) => void;
};

export function SearchResults({
  id,
  products,
  normalizedQuery,
  isLoading,
  errorMessage,
  activeIndex,
  onActiveIndexChange,
  onSelect,
}: SearchResultsProps) {
  const hasResults = products.length > 0 && !isLoading && !errorMessage;

  return (
    <div
      aria-live="polite"
      className="absolute inset-x-0 top-full z-30 mt-2 max-h-96 overflow-y-auto rounded-md border border-zinc-700 bg-background"
      id={id}
      role={hasResults ? "listbox" : undefined}
    >
      {isLoading ? (
        <SearchResultsSkeleton />
      ) : errorMessage ? (
        <p className="px-4 py-5 text-sm text-red-300" role="alert">
          {errorMessage}
        </p>
      ) : products.length === 0 ? (
        <p className="px-4 py-5 text-sm text-zinc-300" role="status">
          Nenhum produto encontrado para “{normalizedQuery}”.
        </p>
      ) : (
        <div aria-label="Produtos encontrados">
          {products.map((product, index) => {
            const isActive = activeIndex === index;

            return (
              <button
                aria-selected={isActive}
                className={`flex w-full items-center gap-3 border-b border-zinc-800 px-3 py-3 text-left transition-colors last:border-b-0 focus-visible:bg-zinc-800 focus-visible:outline-none ${
                  isActive ? "bg-zinc-800" : "hover:bg-zinc-900"
                }`}
                id={`${id}-option-${index}`}
                key={product.id}
                onClick={() => onSelect(product)}
                onMouseEnter={() => onActiveIndexChange(index)}
                role="option"
                tabIndex={-1}
                type="button"
              >
                <span className="relative size-14 shrink-0 overflow-hidden rounded-md bg-white">
                  <Image
                    alt=""
                    className="object-contain p-1"
                    fill
                    sizes="56px"
                    src={product.productImage}
                  />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-sm font-medium leading-5 text-foreground">
                    {product.name}
                  </span>

                  <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <strong className="text-sm text-primary">
                      {formatCentsToBRL(product.priceInCents)}
                    </strong>

                    <span
                      className={`text-xs ${
                        product.stockQuantity > 0
                          ? "text-emerald-300"
                          : "text-red-300"
                      }`}
                    >
                      {product.stockQuantity > 0 ? "Em estoque" : "Esgotado"}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}