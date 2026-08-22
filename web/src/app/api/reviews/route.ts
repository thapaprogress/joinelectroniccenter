import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const modelCode = searchParams.get("modelCode");

    if (!productId && !modelCode) {
      return NextResponse.json({ success: false, message: "productId or modelCode is required" }, { status: 400 });
    }

    let targetProductId = productId;
    if (!targetProductId && modelCode) {
      const product = await prisma.product.findUnique({
        where: { modelCode },
      });
      if (product) {
        targetProductId = product.id;
      }
    }

    if (!targetProductId) {
      return NextResponse.json({ success: true, reviews: [], count: 0, averageRating: 5.0 });
    }

    const reviews = await prisma.review.findMany({
      where: { productId: targetProductId },
      orderBy: { createdAt: "desc" },
    });

    const count = reviews.length;
    const avg = count > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / count).toFixed(1) : "4.9";

    return NextResponse.json({
      success: true,
      reviews,
      count,
      averageRating: parseFloat(avg),
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, modelCode, authorName, location, rating, title, comment } = body;

    if (!authorName || !comment || !rating) {
      return NextResponse.json({ success: false, message: "Name, rating, and comment are required" }, { status: 400 });
    }

    let targetProductId = productId;
    if (!targetProductId && modelCode) {
      const product = await prisma.product.findUnique({
        where: { modelCode },
      });
      if (product) {
        targetProductId = product.id;
      }
    }

    if (!targetProductId) {
      // Create review with first available product or fallback
      const fallbackProduct = await prisma.product.findFirst();
      targetProductId = fallbackProduct?.id;
    }

    if (!targetProductId) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    const newReview = await prisma.review.create({
      data: {
        productId: targetProductId,
        authorName: authorName.trim(),
        location: (location || "Kathmandu").trim(),
        rating: Math.min(5, Math.max(1, parseInt(rating))),
        title: title ? title.trim() : "Verified Showroom Buyer",
        comment: comment.trim(),
        verified: true,
      },
    });

    return NextResponse.json({ success: true, review: newReview }, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ success: false, message: "Failed to submit review" }, { status: 500 });
  }
}
