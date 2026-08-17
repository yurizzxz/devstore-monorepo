import { prisma, type Prisma, type Product } from "@repo/prisma/client";

export type CatalogFilters = {
  categorySlugs?: string[];
  brandSlugs?: string[];
  attributes?: Record<string, string[]>;
  onSale?: boolean;
  minPriceInCents?: number;
  maxPriceInCents?: number;
};

export type CatalogFilterOption = {
  value: string;
  label: string;
};

export type CatalogFilterData = {
  categories: CatalogFilterOption[];
  brands: CatalogFilterOption[];
  attributes: Array<{
    key: string;
    label: string;
    options: CatalogFilterOption[];
  }>;
  priceRange: {
    minInCents: number;
    maxInCents: number;
  };
};

export class PrismaCatalogRepository {
  async findCategoryBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
      select: { id: true, name: true, slug: true },
    });
  }

  async listProducts(
    filters: CatalogFilters,
    categorySlug?: string,
  ): Promise<Product[]> {
    return prisma.product.findMany({
      where: this.buildProductsWhere(filters, categorySlug),
      orderBy: { createdAt: "desc" },
    });
  }

  async getFilterData(categorySlug?: string): Promise<CatalogFilterData> {
    const categoryScope = this.getCategoryScope(categorySlug);

    const [categories, brands, attributes, priceRange] = await Promise.all([
      prisma.category.findMany({
        where: categorySlug
          ? { parent: { is: { slug: categorySlug } } }
          : { parentId: null },
        orderBy: { name: "asc" },
        select: { name: true, slug: true },
      }),
      prisma.brand.findMany({
        where: { products: { some: categoryScope } },
        orderBy: { name: "asc" },
        select: { name: true, slug: true },
      }),
      prisma.attribute.findMany({
        where: { products: { some: { product: categoryScope } } },
        orderBy: { name: "asc" },
        select: {
          key: true,
          name: true,
          unit: true,
          products: {
            where: { product: categoryScope },
            select: { valueText: true, valueNumber: true, valueBoolean: true },
          },
        },
      }),
      prisma.product.aggregate({
        where: categoryScope,
        _min: { priceInCents: true },
        _max: { priceInCents: true },
      }),
    ]);

    return {
      categories: categories.map((category) => ({
        value: category.slug,
        label: category.name,
      })),
      brands: brands.map((brand) => ({ value: brand.slug, label: brand.name })),
      attributes: attributes
        .map((attribute) => {
          const options = new Map<string, string>();

          for (const product of attribute.products) {
            if (product.valueText !== null) {
              options.set(product.valueText, product.valueText);
            }
            if (product.valueNumber !== null) {
              options.set(
                String(product.valueNumber),
                `${product.valueNumber}${attribute.unit ?? ""}`,
              );
            }
            if (product.valueBoolean !== null) {
              options.set(
                String(product.valueBoolean),
                product.valueBoolean ? "Sim" : "Não",
              );
            }
          }

          return {
            key: attribute.key,
            label: attribute.name,
            options: Array.from(options, ([value, label]) => ({
              value,
              label,
            })).sort((first, second) =>
              first.label.localeCompare(second.label),
            ),
          };
        })
        .filter((attribute) => attribute.options.length > 0),
      priceRange: {
        minInCents: priceRange._min.priceInCents ?? 0,
        maxInCents: priceRange._max.priceInCents ?? 0,
      },
    };
  }

  private getCategoryScope(categorySlug?: string): Prisma.ProductWhereInput {
    if (!categorySlug) return {};

    return {
      category: {
        is: {
          OR: [
            { slug: categorySlug },
            { parent: { is: { slug: categorySlug } } },
          ],
        },
      },
    };
  }

  private buildProductsWhere(
    filters: CatalogFilters,
    categorySlug?: string,
  ): Prisma.ProductWhereInput {
    const now = new Date();
    const conditions: Prisma.ProductWhereInput[] = [
      this.getCategoryScope(categorySlug),
    ];

    if (filters.categorySlugs?.length) {
      conditions.push({
        category: {
          is: {
            OR: [
              { slug: { in: filters.categorySlugs } },
              { parent: { is: { slug: { in: filters.categorySlugs } } } },
            ],
          },
        },
      });
    }

    if (filters.brandSlugs?.length) {
      conditions.push({ brand: { is: { slug: { in: filters.brandSlugs } } } });
    }

    if (filters.onSale) {
      conditions.push({
        promotions: {
          some: {
            promotion: {
              isActive: true,
              startsAt: { lte: now },
              endsAt: { gte: now },
            },
          },
        },
      });
    }

    if (
      filters.minPriceInCents !== undefined ||
      filters.maxPriceInCents !== undefined
    ) {
      conditions.push({
        priceInCents: {
          gte: filters.minPriceInCents,
          lte: filters.maxPriceInCents,
        },
      });
    }

    for (const [attributeKey, values] of Object.entries(
      filters.attributes ?? {},
    )) {
      const numberValues = values.map(Number).filter(Number.isFinite);
      const booleanValues = values
        .filter((value) => value === "true" || value === "false")
        .map((value) => value === "true");

      conditions.push({
        productAttributes: {
          some: {
            attribute: { is: { key: attributeKey } },
            OR: [
              { valueText: { in: values } },
              ...(numberValues.length
                ? [{ valueNumber: { in: numberValues } }]
                : []),
              ...(booleanValues.length
                ? [{ valueBoolean: { in: booleanValues } }]
                : []),
            ],
          },
        },
      });
    }

    return { AND: conditions };
  }
}
