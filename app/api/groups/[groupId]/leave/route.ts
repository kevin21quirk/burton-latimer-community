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

    const member = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: session.userId,
          groupId: groupId,
        },
      },
    });

    if (!member) {
      return NextResponse.json(
        { message: "Not a member of this group" },
        { status: 400 }
      );
    }

    await prisma.groupMember.delete({
      where: { id: member.id },
    });

    return NextResponse.json({ message: "Left group successfully" });
  } catch (error) {
    console.error("Leave group error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
