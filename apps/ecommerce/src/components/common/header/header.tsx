"use client";

import CartList from "@/components/ui/cart-list";
import { Menu, ShoppingCart, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import {
  DropdownBody,
  DropdownLink,
  DropdownRoot,
} from "@/components/ui/dropdown-menu";
import SearchBar from "@/components/common/searchbar";
import { PromotionsBar } from "./promotions-bar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui/components/sheet";

export const Header = () => {
  const [openDropdown, setDropdownOpen] = useState<boolean>(false);

  return (
    <>
      <header className="sticky top-0 w-full z-20 bg-background border-b border-zinc-800">
        <PromotionsBar />
        <nav className="max-w-360 mx-auto px-3 pb-4">
          <div className="py-5 w-full flex justify-between items-center">
            <Link href="/">
              <Image
                alt="DevStore"
                src="/devstore.png"
                width={125}
                height={120}
                className="md:w-50 h-auto"
              />
            </Link>

            <div className="hidden md:flex px-16 mt-1 w-full">
              <SearchBar />
            </div>

            <div className="relative flex items-center space-x-6 ">
              <button
                type="button"
                className="cursor-pointer flex flex-row items-center gap-2 "
                onClick={() =>
                  openDropdown ? setDropdownOpen((prev) => !prev) : null
                }
              >
                <Link href="/login" className="flex items-center gap-2">
                  <User className="size-7 shrink-0" />
                  <p className="hidden md:block text-md">Entrar/Criar Conta</p>
                </Link>
              </button>
              <DropdownRoot
                openDo={openDropdown}
                setDropdownOpen={setDropdownOpen}
              >
                <DropdownBody>
                  <DropdownLink href="/login">Entrar</DropdownLink>
                </DropdownBody>
              </DropdownRoot>

              <Sheet>
                <SheetTrigger className="flex flex-row items-center gap-2 cursor-pointer">
                  <ShoppingCart className="size-7" />
                  <span className="hidden md:block text-md">Carrinho</span>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Carrinho</SheetTitle>
                  </SheetHeader>

                  <CartList />
                </SheetContent>
              </Sheet>

              <div className="md:hidden flex gap-3">
                <Sheet side="right">
                  <SheetTrigger className="md:hidden text-white">
                    <Menu className="size-7" />
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>

          <div className="flex md:hidden py-2 w-full">
            <SearchBar />
          </div>

          <div className="hidden md:flex items-center justify-center py-2">
            <ul className="flex flex-row space-x-10 items-center">
              {/* <NavLinks /> */}
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
};
