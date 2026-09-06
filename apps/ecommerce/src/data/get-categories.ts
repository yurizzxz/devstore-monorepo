import { prisma } from "@repo/prisma/client";
import { unstable_cache } from "next/cache";

export const getCategories = unstable_cache(
  () =>
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
  ["header-categories"],
  {
    revalidate: 3600,
    tags: ["categories"],
  },
);
