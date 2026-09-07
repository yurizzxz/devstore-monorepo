import { PrismaCatalogRepository } from "@repo/db/repositories/prisma-catalog-repository";
import { NextResponse } from "next/server";
import { z } from "zod";

const searchSchema = z.object({
  q: z.string().trim().min(2).max(80),
});

const catalogRepository = new PrismaCatalogRepository();

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const parsedQuery = searchSchema.safeParse({
    q: searchParams.get("q"),
  });

  if (!parsedQuery.success) {
    return NextResponse.json(
      {
        products: [],
        message: "Informe entre 2 e 80 caracteres.",
      },
      { status: 400 },
    );
  }

  try {
    const products = await catalogRepository.searchProducts(
      parsedQuery.data.q,
      5,
    );

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Falha ao pesquisar produtos", error);

    return NextResponse.json(
      {
        products: [],
        message: "Não foi possível pesquisar produtos.",
      },
      { status: 500 },
    );
  }
}
