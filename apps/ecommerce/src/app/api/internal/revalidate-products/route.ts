import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const revalidateSecret = process.env.REVALIDATE_SECRET;

  if (!revalidateSecret) {
    return NextResponse.json(
      { error: "Cache revalidation is not configured" },
      { status: 500 },
    );
  }

  const authorization = request.headers.get("authorization");

  if (authorization !== `Bearer ${revalidateSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidateTag("products");

  return NextResponse.json({ revalidated: true });
}
