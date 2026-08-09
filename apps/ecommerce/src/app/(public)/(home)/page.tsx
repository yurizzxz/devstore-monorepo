import ProductItem from "@/components/common/product-item";
import Banner from "@/components/ui/banner";
import { prisma } from "@repo/prisma/client";

export default async function  Home() {
  const featuredProducts = await prisma.product.findMany({
    where: {
      isFeatured: true,
    },
  });
  return (
    <section className="pt-0 pb-15 space-y-6 sm:space-y-10 md:space-y-12 lg:space-y-16">
      <Banner urlImage="/banner1.png" altImage="Banner Promoções" />

      <div className="mt-4 space-y-6 mx-auto max-w-360 px-3">
        <h1 className="text-3xl font-semibold">Produtos em destaque</h1>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-6">
          {featuredProducts.map((product) => (
            <div key={product.id}>
              <ProductItem product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
