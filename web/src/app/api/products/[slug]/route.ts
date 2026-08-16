import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const products = await prisma.product.findMany({ select: { slug: true } });
  return products.map((p) => ({ slug: p.slug }));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: slug },
          { modelCode: slug },
        ],
      },
      include: {
        brand: true,
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Get related products from same category or brand
    const related = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      include: {
        brand: { select: { name: true } },
      },
      take: 4,
    });

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        specsList: product.specsList ? JSON.parse(product.specsList) : [],
      },
      related: related.map((r) => ({
        ...r,
        specsList: r.specsList ? JSON.parse(r.specsList) : [],
      })),
    });
  } catch (error: any) {
    console.error("Error fetching product detail:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch product details" },
      { status: 500 }
    );
  }
}
