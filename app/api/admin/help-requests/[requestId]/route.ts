import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const session = await requireAuth();
    const { requestId } = await params;

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { isAdmin: true },
    });

    if (!user?.isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    await prisma.helpRequest.delete({
      where: { id: requestId },
    });

    return NextResponse.json({ message: "Help request deleted successfully" });
  } catch (error) {
    console.error("Delete help request error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
