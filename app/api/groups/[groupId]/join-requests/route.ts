import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// Get join requests for a group (group admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const session = await requireAuth();
    const { groupId } = await params;

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

    const joinRequests = await prisma.groupJoinRequest.findMany({
      where: {
        groupId: groupId,
        status: "PENDING",
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(joinRequests);
  } catch (error) {
    console.error("Get join requests error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
