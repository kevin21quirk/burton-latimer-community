import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// Remove/block a member from group (group admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string; memberId: string }> }
) {
  try {
    const session = await requireAuth();
    const { groupId, memberId } = await params;

    // Check if user is group admin
    const membership = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: session.userId,
          groupId: groupId,
        },
      },
    });

    if (!membership || membership.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    // Get the member to remove
    const memberToRemove = await prisma.groupMember.findUnique({
      where: { id: memberId },
    });

    if (!memberToRemove || memberToRemove.groupId !== groupId) {
      return NextResponse.json(
        { message: "Member not found" },
        { status: 404 }
      );
    }

    // Prevent removing the group creator
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: { creatorId: true },
    });

    if (group?.creatorId === memberToRemove.userId) {
      return NextResponse.json(
        { message: "Cannot remove group creator" },
        { status: 400 }
      );
    }

    // Remove member
    await prisma.groupMember.delete({
      where: { id: memberId },
    });

    return NextResponse.json({ message: "Member removed successfully" });
  } catch (error) {
    console.error("Remove member error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
