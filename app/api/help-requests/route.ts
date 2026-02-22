import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

const createHelpRequestSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(["COMPANIONSHIP", "FOOD_SUPPORT", "TRANSPORT", "HOME_HELP", "EMERGENCY", "OTHER"]),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  location: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const data = createHelpRequestSchema.parse(body);

    const helpRequest = await prisma.helpRequest.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        urgency: data.urgency,
        location: data.location,
        requesterId: session.userId,
      },
    });

    return NextResponse.json(helpRequest, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid data", errors: error.issues },
        { status: 400 }
      );
    }

    console.error("Create help request error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await requireAuth();

    const helpRequests = await prisma.helpRequest.findMany({
      where: {
        status: "OPEN",
      },
      include: {
        requester: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            city: true,
          },
        },
      },
      orderBy: [
        { urgency: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(helpRequests);
  } catch (error) {
    console.error("Get help requests error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
