import { prisma } from "@repo/prisma/client";
import { notFound } from "next/navigation";
import ProductItem from "@/components/common/product-item";

type ProductsByCategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function AllProducts({
  params,
}: ProductsByCategoryPageProps) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: {
      slug: slug,
    },
  });

  if (!category) {
    return notFound();
  }

  const products = await prisma.product.findMany({
    where: {
      category: {
        slug: slug,
      },
    },
  });

  return (
    <section className="max-w-360 mx-auto px-3 py-4 mt-4 space-y-6 ">
      <h1 className="text-3xl font-semibold">{category.name}</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5 lg:grid-cols-6 space-y-6">
        {products.map((product) => (
          <ProductItem
            textContainerClassName="w-full"
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}
