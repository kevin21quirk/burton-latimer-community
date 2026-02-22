import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  try {
    const session = await requireAuth();
    const { serviceId } = await params;

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

    const service = await prisma.localService.update({
      where: { id: serviceId },
      data: { isVerified: true },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error("Verify service error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
