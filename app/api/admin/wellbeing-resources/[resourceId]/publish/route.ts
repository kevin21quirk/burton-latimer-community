import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ resourceId: string }> }
) {
  try {
    const session = await requireAuth();
    const { resourceId } = await params;

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

    // Toggle published status
    const currentResource = await prisma.wellbeingResource.findUnique({
      where: { id: resourceId },
      select: { isPublished: true },
    });

    if (!currentResource) {
      return NextResponse.json(
        { message: "Resource not found" },
        { status: 404 }
      );
    }

    const resource = await prisma.wellbeingResource.update({
      where: { id: resourceId },
      data: { isPublished: !currentResource.isPublished },
    });

    return NextResponse.json(resource);
  } catch (error) {
    console.error("Publish resource error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
