import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production"
);

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ reportId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token.value, JWT_SECRET);
    const userId = payload.userId as string;

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isAdmin: true },
    });

    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { reportId } = await params;
    const { action } = await request.json();

    if (action !== "approve" && action !== "deny") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const report = await prisma.report.update({
      where: { id: reportId },
      data: {
        status: action === "approve" ? "APPROVED" : "DENIED",
        reviewedBy: userId,
        reviewedAt: new Date(),
      },
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error updating report:", error);
    return NextResponse.json(
      { error: "Failed to update report" },
      { status: 500 }
    );
  }
}
