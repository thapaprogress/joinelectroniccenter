import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-static";

const InquirySchema = z.object({
  name: z.string().default("Customer"),
  phone: z.string().min(6, "Valid phone number is required"),
  message: z.string().optional(),
  productModel: z.string().optional(),
  type: z.string().default("general"),
  estimatedValue: z.number().optional(),
  oldItemCondition: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = InquirySchema.parse(body);

    const inquiry = await prisma.inquiry.create({
      data: {
        name: validated.name,
        phone: validated.phone,
        message: validated.message || `Customer inquiry for ${validated.productModel || "general appliances"}`,
        productModel: validated.productModel,
        type: validated.type,
        estimatedValue: validated.estimatedValue,
        oldItemCondition: validated.oldItemCondition,
      },
    });

    // Alert Store Owner Console / Webhook Notification
    console.log(`\n==================================================`);
    console.log(`🔔 [STORE OWNER ALERT] NEW CUSTOMER LEAD RECEIVED!`);
    console.log(`   Customer: ${validated.name} (${validated.phone})`);
    console.log(`   Type: ${validated.type.toUpperCase()}`);
    console.log(`   Model / Message: ${validated.productModel || validated.message}`);
    console.log(`   Estimated Value: Rs. ${(validated.estimatedValue || 0).toLocaleString("en-NP")}`);
    console.log(`==================================================\n`);

    return NextResponse.json({
      success: true,
      inquiry,
      message: "Inquiry received. Our showroom team has been alerted!",
    });
  } catch (error: any) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json(
      { success: false, error: error.errors || error.message || "Failed to process inquiry" },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      inquiries,
    });
  } catch (error: any) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}
