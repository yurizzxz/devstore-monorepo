import { prisma } from "@repo/prisma/client";
import ProductItem from "@/components/common/product-item";


export default async function ProductCategories() {

  const products = await prisma.product.findMany();

  return (
    <section className="max-w-360 mx-auto px-3 py-4 mt-4 space-y-6 ">
      <h1 className="text-3xl font-semibold">Produtos</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 space-y-6">
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
