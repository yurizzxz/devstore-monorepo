import { prisma } from "@repo/prisma/client";
import ProductItem from "@/components/common/product-item";
import { ProductFilters } from "@/components/common/product-filters";

export default async function ProductCategories() {
  const products = await prisma.product.findMany();

  return (
    <section className="max-w-360 mx-auto mt-4 space-y-8 px-3 py-4">
      <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <ProductFilters />

        <div className="space-y-8">
          <h1 className="text-4xl font-semibold">Produtos</h1>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => (
              <ProductItem
                textContainerClassName="w-full"
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
