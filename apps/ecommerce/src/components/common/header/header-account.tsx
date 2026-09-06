import { prisma } from "@repo/prisma/client";

import type { HeaderCategory } from "./header";
import { HeaderAccountClient } from "./header-account-client";
import { requireCustomer } from "@/lib/require-customer";

type HeaderAccountProps = {
  categories: HeaderCategory[];
};

export async function HeaderAccount({ categories }: HeaderAccountProps) {
  const session = await requireCustomer();

  const cart = session
    ? await prisma.cart.findUnique({
        where: { userId: session.user.id },
        select: {
          id: true,
          totalInCents: true,
          items: {
            select: {
              id: true,
              productId: true,
              quantity: true,
              product: {
                select: {
                  name: true,
                  slug: true,
                  productImage: true,
                  stockQuantity: true,
                  priceInCents: true,
                },
              },
            },
          },
        },
      })
    : null;

  return (
    <HeaderAccountClient
      cart={cart}
      categories={categories}
      user={session.user ?? null}
    />
  );
}
