import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

const createGroupSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  isPrivate: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const data = createGroupSchema.parse(body);

    const group = await prisma.group.create({
      data: {
        name: data.name,
        description: data.description,
        isPrivate: data.isPrivate,
        members: {
          create: {
            userId: session.userId,
            role: "admin",
          },
        },
      },
      include: {
        members: {
          select: {
            userId: true,
            role: true,
          },
        },
        _count: {
          select: {
            members: true,
            posts: true,
          },
        },
      },
    });

    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid data", errors: error.issues },
        { status: 400 }
      );
    }

    console.error("Create group error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const groups = await prisma.group.findMany({
      include: {
        members: {
          select: {
            userId: true,
            role: true,
          },
        },
        _count: {
          select: {
            members: true,
            posts: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(groups);
  } catch (error) {
    console.error("Get groups error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
