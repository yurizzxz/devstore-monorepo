import { prisma } from "@repo/prisma/client";
import { formatCentsToBRL } from "@repo/utils/money";
import ProductItem from "@/components/common/product-item";
import { Check, ShieldCheck, Star, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@repo/ui/components/badge";
import { AddToCartButton } from "@/components/common/add-to-cart-button";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) {
    notFound();
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: 6,
  });

  const isInStock = product.stockQuantity > 0;
  const installmentInCents = Math.ceil(product.priceInCents / 10);

  return (
    <main className="mx-auto w-full max-w-360 px-4 py-10 md:px-8">
      <nav
        aria-label="Caminho de navegação"
        className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-300"
      >
        <Link href="/" className="transition-colors hover:text-primary">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href={`/products/${product.category.slug}`}
          className="transition-colors hover:text-primary"
        >
          {product.category.name}
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="max-w-60 truncate text-foreground">
          {product.name}
        </span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)] lg:gap-10">
        <section className="flex min-w-0 flex-col gap-5">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.productImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-contain p-6"
            />
          </div>
        </section>

        <section className="flex min-w-0 flex-col">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <Badge className="inline-flex h-8 items-center rounded-full px-3 text-sm font-medium text-zinc-200">
              {product.category.name}
            </Badge>
            {product.isFeatured && (
              <Badge className="inline-flex h-8 items-center rounded-full bg-purple-bold px-3 text-xs font-bold text-white">
                Destaque
              </Badge>
            )}
            <Badge variant="secondary" className="inline-flex h-8 items-center gap-2 rounded-full px-3 text-sm text-zinc-300">
              <ShieldCheck className="size-5 text-purple" />
              Compra protegida e envio para todo Brasil
            </Badge>
          </div>

          <h1 className="max-w-3xl text-3xl font-bold tracking-[-0.03em] text-balance md:text-5xl">
            {product.name}
          </h1>

          <div className="mt-5 flex items-center gap-2">
            <div className="flex items-center gap-1 text-gold">
              <Star className="size-5 fill-current text-gold" />
              <span className="font-semibold">
                {product.avaliationStars.toFixed(1)}
              </span>
            </div>
            <span className="text-sm text-zinc-300">Avaliação do produto</span>
          </div>

          <p className="mt-6 max-w-2xl text-base leading-7 text-gray-200 md:text-lg">
            {product.description}
          </p>

          <div className="mt-8 border-y py-6">
            <p className="text-sm text-zinc-300">À vista no Pix</p>
            <p className="mt-1 text-4xl font-bold tracking-[-0.03em] text-primary md:text-5xl">
              {formatCentsToBRL(product.priceInCents)}
            </p>
            <p className="mt-2 text-sm text-gray-200">
              Ou 10x de {formatCentsToBRL(installmentInCents)} sem juros
            </p>
          </div>

          <div className="mt-6 flex items-center gap-3 text-sm font-medium">
            <Check
              className={
                isInStock ? "size-5 text-green-400" : "size-5 text-danger"
              }
            />
            {isInStock
              ? `Em estoque: ${product.stockQuantity} unidades`
              : "Produto indisponível"}
          </div>

          <AddToCartButton disabled={!isInStock} productId={product.id} />

          <div className="mt-8 flex gap-3 border-t pt-6 text-sm leading-6 text-zinc-300">
            <Truck className="mt-0.5 size-5 shrink-0 text-purple" />
            Frete calculado no checkout. Produtos em estoque seguem para envio
            após confirmação do pagamento.
          </div>
        </section>
      </div>

      <section className="mt-16 max-w-4xl border-t pt-8 md:mt-24">
        <h2 className="text-2xl font-bold tracking-[-0.02em]">
          Especificações
        </h2>
        <p className="mt-4 whitespace-pre-line text-base leading-7 text-gray-200">
          {product.specifications}
        </p>
      </section>

      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t pt-8 md:mt-24">
          <h2 className="text-2xl font-bold tracking-[-0.02em]">
            Produtos relacionados
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5 lg:grid-cols-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductItem key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
