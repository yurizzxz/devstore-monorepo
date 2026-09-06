import { prisma } from "@repo/prisma/client";
import { unstable_cache } from "next/cache";

const PRODUCT_CACHE_REVALIDATE_SECONDS = 800;

export const getFeaturedProducts = unstable_cache(
  () =>
    prisma.product.findMany({
      where: { isFeatured: true },
    }),
  ["featured-products"],
  {
    revalidate: PRODUCT_CACHE_REVALIDATE_SECONDS,
    tags: ["products"],
  },
);

export const getProducts = unstable_cache(
  () => prisma.product.findMany(),
  ["products"],
  {
    revalidate: PRODUCT_CACHE_REVALIDATE_SECONDS,
    tags: ["products"],
  },
);

export const getProductsByCategorySlug = unstable_cache(
  (categorySlug: string) =>
    prisma.product.findMany({
      where: {
        category: {
          slug: categorySlug,
        },
      },
    }),
  ["products-by-category-slug"],
  {
    revalidate: PRODUCT_CACHE_REVALIDATE_SECONDS,
    tags: ["products"],
  },
);

export async function getProductBySlug(slug: string) {
  return unstable_cache(
    () =>
      prisma.product.findUnique({
        where: { slug },
        include: {
          category: {
            include: {
              products: {
                where: { slug: { not: slug } },
                orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
                take: 6,
                select: {
                  id: true,
                  name: true,
                  description: true,
                  slug: true,
                  productImage: true,
                  priceInCents: true,
                },
              },
            },
          },
        },
      }),
    ["product-by-slug", slug],
    {
      revalidate: PRODUCT_CACHE_REVALIDATE_SECONDS,
      tags: ["products", `product:${slug}`],
    },
  )();
}
