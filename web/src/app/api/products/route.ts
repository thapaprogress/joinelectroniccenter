import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-static";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const brand = searchParams.get("brand")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "0");
    const sort = searchParams.get("sort") || "featured"; // price-asc, price-desc, name-asc, newest
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "24")));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (brand) {
      where.brand = {
        name: { equals: brand },
      };
    }

    if (category) {
      where.category = {
        name: { equals: category },
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { modelCode: { contains: search } },
        { detailedSpecs: { contains: search } },
        { type: { contains: search } },
      ];
    }

    if (minPrice > 0 || maxPrice > 0) {
      where.mrpNpr = {};
      if (minPrice > 0) where.mrpNpr.gte = minPrice;
      if (maxPrice > 0) where.mrpNpr.lte = maxPrice;
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "price-asc") orderBy = { mrpNpr: "asc" };
    else if (sort === "price-desc") orderBy = { mrpNpr: "desc" };
    else if (sort === "name-asc") orderBy = { name: "asc" };

    const [total, products, brands, categories] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          brand: { select: { name: true, slug: true } },
          category: { select: { name: true, slug: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.brand.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          _count: { select: { products: true } },
        },
        orderBy: { name: "asc" },
      }),
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          _count: { select: { products: true } },
        },
        orderBy: { name: "asc" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      products: products.map((p) => ({
        ...p,
        specsList: p.specsList ? JSON.parse(p.specsList) : [],
      })),
      filters: {
        brands,
        categories,
      },
    });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}
