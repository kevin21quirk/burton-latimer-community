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

    await prisma.groupMember.create({
      data: {
        userId: session.userId,
        groupId: groupId,
        role: "member",
      },
    });

    return NextResponse.json({ message: "Joined group successfully" });
  } catch (error) {
    console.error("Join group error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
