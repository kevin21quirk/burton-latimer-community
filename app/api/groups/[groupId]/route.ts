import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

const updateGroupSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  isPrivate: z.boolean().optional(),
  image: z.string().optional(),
});

// Update group details (group admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const session = await requireAuth();
    const { groupId } = await params;
    const body = await request.json();
    const data = updateGroupSchema.parse(body);

    // Check if user is group creator
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: { creatorId: true },
    });

    if (!group || group.creatorId !== session.userId) {
      return NextResponse.json(
        { message: "Unauthorized - Only group creator can update" },
        { status: 403 }
      );
    }

    const updatedGroup = await prisma.group.update({
      where: { id: groupId },
      data,
    });

    return NextResponse.json(updatedGroup);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid data", errors: error.issues },
        { status: 400 }
      );
    }

    console.error("Update group error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
