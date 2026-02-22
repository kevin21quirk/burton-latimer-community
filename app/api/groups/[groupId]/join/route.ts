import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const session = await requireAuth();
    const { groupId } = await params;

    // Check if already a member
    const existingMember = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: session.userId,
          groupId: groupId,
        },
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { message: "Already a member of this group" },
        { status: 400 }
      );
    }

    // Check if already has a pending request
    const existingRequest = await prisma.groupJoinRequest.findUnique({
      where: {
        userId_groupId: {
          userId: session.userId,
          groupId: groupId,
        },
      },
    });

    if (existingRequest) {
      if (existingRequest.status === "PENDING") {
        return NextResponse.json(
          { message: "Join request already pending" },
          { status: 400 }
        );
      } else if (existingRequest.status === "REJECTED") {
        return NextResponse.json(
          { message: "Your join request was rejected" },
          { status: 400 }
        );
      }
    }

    // Create join request (requires group admin approval)
    await prisma.groupJoinRequest.create({
      data: {
        userId: session.userId,
        groupId: groupId,
        status: "PENDING",
      },
    });

    return NextResponse.json({ 
      message: "Join request sent! Waiting for group admin approval." 
    });
  } catch (error) {
    console.error("Join group error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
