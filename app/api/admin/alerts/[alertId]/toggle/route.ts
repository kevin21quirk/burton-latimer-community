import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ alertId: string }> }
) {
  try {
    const session = await requireAuth();
    const { alertId } = await params;

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

    // Toggle active status
    const currentAlert = await prisma.alert.findUnique({
      where: { id: alertId },
      select: { isActive: true },
    });

    if (!currentAlert) {
      return NextResponse.json(
        { message: "Alert not found" },
        { status: 404 }
      );
    }

    const alert = await prisma.alert.update({
      where: { id: alertId },
      data: { isActive: !currentAlert.isActive },
    });

    return NextResponse.json(alert);
  } catch (error) {
    console.error("Toggle alert error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
