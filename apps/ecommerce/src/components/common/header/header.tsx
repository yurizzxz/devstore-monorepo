import SearchBar from "@/components/common/searchbar";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { HeaderAccount } from "./header-account";
import { PromotionsBar } from "./promotions-bar";

export type HeaderCategory = {
  id: string;
  slug: string;
  name: string;
};

type HeaderProps = {
  categories: HeaderCategory[];
};

function HeaderAccountFallback() {
  return (
    <div
      aria-label="Carregando dados da conta"
      className="flex items-center gap-5"
      role="status"
    >
      <span className="hidden h-7 w-24 rounded-md bg-zinc-800 motion-safe:animate-pulse md:block" />
      <span className="size-7 rounded-md bg-zinc-800 motion-safe:animate-pulse" />
    </div>
  );
}

export function Header({ categories }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-zinc-800 bg-background">
      <PromotionsBar />
      <nav className="mx-auto max-w-360 px-3 pb-4">
        <div className="flex w-full items-center justify-between py-5">
          <Link href="/">
            <Image
              alt="DevStore"
              className="h-auto md:w-50"
              height={120}
              priority
              src="/devstore.png"
              width={125}
            />
          </Link>

          <div className="mt-1 hidden w-full px-16 md:flex">
            <SearchBar />
          </div>

          <Suspense fallback={<HeaderAccountFallback />}>
            <HeaderAccount categories={categories} />
          </Suspense>
        </div>

        <div className="flex w-full py-2 md:hidden">
          <SearchBar />
        </div>

        <div className="hidden items-center justify-center py-2 md:flex">
          <ul className="flex flex-row items-center space-x-10">
            {categories.map((category) => (
              <li key={category.id}>
                <Link href={`/products/${category.slug}`}>{category.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
