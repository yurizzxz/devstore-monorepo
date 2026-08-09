import { cn } from "@repo/ui/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { formatCentsToBRL } from "@repo/utils/money";
import type { Product } from "@repo/prisma/client";
import { Card } from "@repo/ui/components/card";

interface ProductItemProps {
  product: Pick<
    Product,
    "id" | "name" | "description" | "slug" | "productImage" | "priceInCents"
  >;
  textContainerClassName?: string;
}

const ProductItem = ({ product, textContainerClassName }: ProductItemProps) => {
  return (
    <Card className="pt-0">
      <Link href={`/product/${product.slug}`} className="flex flex-col gap-4">
        <Image
          src={product.productImage}
          alt={product.name}
          sizes="100vw"
          width={0}
          height={0}
          className="h-auto w-full rounded-xl"
        />
        <div
          className={cn(
            "flex max-w-[200px] flex-col gap-1 px-3",
            textContainerClassName,
          )}
        >
          <p className="truncate text-lg font-medium">{product.name}</p>
          <p className="text-muted-foreground truncate text-xs font-medium">
            {product.description}
          </p>
          <p className="truncate text-2xl text-primary font-semibold">
            {formatCentsToBRL(product.priceInCents)}
          </p>
        </div>
      </Link>
    </Card>
  );
};

export default ProductItem;
