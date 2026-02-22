import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postcode: z.string().optional(),
  companyName: z.string().optional(),
  charityNumber: z.string().optional(),
  bio: z.string().optional(),
  interests: z.array(z.string()).optional(),
  marketingConsent: z.boolean().optional(),
});

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const data = updateProfileSchema.parse(body);

    const user = await prisma.user.update({
      where: { id: session.userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        address: data.address,
        city: data.city,
        postcode: data.postcode,
        companyName: data.companyName,
        charityNumber: data.charityNumber,
        bio: data.bio,
        interests: data.interests,
        marketingConsent: data.marketingConsent,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        accountType: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid data", errors: error.issues },
        { status: 400 }
      );
    }

    console.error("Update profile error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        accountType: true,
        dateOfBirth: true,
        phoneNumber: true,
        address: true,
        city: true,
        postcode: true,
        companyName: true,
        charityNumber: true,
        bio: true,
        profileImage: true,
        coverImage: true,
        marketingConsent: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
