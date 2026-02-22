import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function DELETE(request: NextRequest) {
  try {
    const session = await requireAuth();

    // Delete user account and all related data
    // Prisma will handle cascade deletes based on schema relations
    await prisma.user.delete({
      where: { id: session.userId },
    });

    // Clear the auth cookie
    const cookieStore = await cookies();
    cookieStore.delete("auth-token");

    return NextResponse.json({ 
      success: true, 
      message: "Account deleted successfully" 
    });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
