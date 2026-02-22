import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

const createServiceSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(["CARE_PROVIDER", "CHARITY", "COUNCIL_SERVICE", "COMMUNITY_CENTRE", "FOOD_BANK", "HEALTH_SERVICE", "OTHER"]),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
});

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const data = createServiceSchema.parse(body);

    const service = await prisma.localService.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        address: data.address,
        phoneNumber: data.phoneNumber,
        email: data.email || null,
        website: data.website || null,
        createdById: session.userId,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid data", errors: error.issues },
        { status: 400 }
      );
    }

    console.error("Create service error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const services = await prisma.localService.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            accountType: true,
          },
        },
      },
      orderBy: [
        { isVerified: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("Get services error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
