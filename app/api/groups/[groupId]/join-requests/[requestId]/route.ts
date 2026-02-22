import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

const actionSchema = z.object({
  action: z.enum(["approve", "reject"]),
});

// Approve or reject join request
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string; requestId: string }> }
) {
  try {
    const session = await requireAuth();
    const { groupId, requestId } = await params;
    const body = await request.json();
    const { action } = actionSchema.parse(body);

    // Check if user is group creator or admin
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: { creatorId: true },
    });

    if (!group) {
      return NextResponse.json(
        { message: "Group not found" },
        { status: 404 }
      );
    }

    // Allow if user is creator
    const isCreator = group.creatorId === session.userId;

    // Or check if user is admin member
    const membership = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: session.userId,
          groupId: groupId,
        },
      },
    });

    const isAdmin = membership?.role === "ADMIN";

    if (!isCreator && !isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized - Only group creator or admin can manage join requests" },
        { status: 403 }
      );
    }

    const joinRequest = await prisma.groupJoinRequest.findUnique({
      where: { id: requestId },
    });

    if (!joinRequest || joinRequest.groupId !== groupId) {
      return NextResponse.json(
        { message: "Join request not found" },
        { status: 404 }
      );
    }

    if (action === "approve") {
      // Add user to group and update request status
      await prisma.$transaction([
        prisma.groupMember.create({
          data: {
            userId: joinRequest.userId,
            groupId: groupId,
            role: "MEMBER",
          },
        }),
        prisma.groupJoinRequest.update({
          where: { id: requestId },
          data: { status: "APPROVED" },
        }),
      ]);

      return NextResponse.json({ message: "Join request approved" });
    } else {
      // Reject request
      await prisma.groupJoinRequest.update({
        where: { id: requestId },
        data: { status: "REJECTED" },
      });

      return NextResponse.json({ message: "Join request rejected" });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid data", errors: error.issues },
        { status: 400 }
      );
    }

    console.error("Handle join request error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
