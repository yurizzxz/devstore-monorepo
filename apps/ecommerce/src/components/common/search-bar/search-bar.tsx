"use client";

import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import {
  type ProductSearchResult,
  useProductSearch,
} from "./use-product-search";

import { SearchResults } from "./search-results";

export default function SearchBar() {
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const { products, isLoading, errorMessage, normalizedQuery, canSearch } =
    useProductSearch(query);

  const showDropdown = isOpen && canSearch;

  useEffect(() => {
    function closeWhenInteractionLeaves(event: PointerEvent | FocusEvent) {
      const target = event.target;

      if (target instanceof Node && !containerRef.current?.contains(target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("pointerdown", closeWhenInteractionLeaves);
    document.addEventListener("focusin", closeWhenInteractionLeaves);

    return () => {
      document.removeEventListener("pointerdown", closeWhenInteractionLeaves);
      document.removeEventListener("focusin", closeWhenInteractionLeaves);
    };
  }, []);

  useEffect(() => {
    if (!canSearch) {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    setIsOpen(true);
    setActiveIndex(-1);
  }, [canSearch, normalizedQuery]);

  function openProduct(product: ProductSearchResult) {
    setIsOpen(false);
    setActiveIndex(-1);
    setQuery("");

    router.push(`/product/${product.slug}`);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const selectedProduct = products[activeIndex] ?? products[0];

    if (selectedProduct) {
      openProduct(selectedProduct);
      return;
    }

    if (canSearch) {
      setIsOpen(true);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (products.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);

      setActiveIndex((currentIndex) =>
        currentIndex >= products.length - 1 ? 0 : currentIndex + 1,
      );

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);

      setActiveIndex((currentIndex) =>
        currentIndex <= 0 ? products.length - 1 : currentIndex - 1,
      );

      return;
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();

      const product = products[activeIndex];

      if (product) {
        openProduct(product);
      }
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <form className="flex w-full gap-2" onSubmit={handleSubmit} role="search">
        <Input
          aria-activedescendant={
            activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          aria-label="Pesquisar produtos"
          autoComplete="off"
          className="h-11 w-full rounded-md"
          maxLength={80}
          onChange={handleChange}
          onFocus={() => {
            if (canSearch) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="O que você procura?"
          role="combobox"
          type="search"
          value={query}
        />

        <Button
          aria-label="Abrir produto encontrado"
          disabled={!canSearch || isLoading}
          size="icon-lg"
          type="submit"
        >
          <Search aria-hidden="true" />
        </Button>
      </form>

      {showDropdown && (
        <SearchResults
          activeIndex={activeIndex}
          errorMessage={errorMessage}
          id={listboxId}
          isLoading={isLoading}
          normalizedQuery={normalizedQuery}
          onActiveIndexChange={setActiveIndex}
          onSelect={openProduct}
          products={products}
        />
      )}
    </div>
  );
}
