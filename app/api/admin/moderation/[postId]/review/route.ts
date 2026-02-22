import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Review and take action on flagged post (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { isAdmin: true },
    });

    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { postId } = await params;
    const { action, notes } = await request.json();

    // Valid actions: 'approve', 'hide', 'delete'
    if (!['approve', 'hide', 'delete'].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (action === 'delete') {
      // Delete the post
      await prisma.post.delete({
        where: { id: postId },
      });

      // Update all related reports
      await prisma.report.updateMany({
        where: { postId: postId },
        data: {
          status: 'RESOLVED',
          reviewedBy: session.userId,
          reviewedAt: new Date(),
        },
      });

      return NextResponse.json({ 
        success: true,
        message: "Post deleted successfully",
      });
    }

    // Update post based on action
    await prisma.post.update({
      where: { id: postId },
      data: {
        isFlagged: action === 'hide',
        isHidden: action === 'hide',
        moderationNotes: notes || null,
        reviewedAt: new Date(),
        reviewedBy: session.userId,
      },
    });

    // Update all related reports
    await prisma.report.updateMany({
      where: { 
        postId: postId,
        status: 'PENDING',
      },
      data: {
        status: 'RESOLVED',
        reviewedBy: session.userId,
        reviewedAt: new Date(),
      },
    });

    return NextResponse.json({ 
      success: true,
      message: `Post ${action === 'approve' ? 'approved' : 'hidden'} successfully`,
    });
  } catch (error) {
    console.error("Error reviewing post:", error);
    return NextResponse.json(
      { error: "Failed to review post" },
      { status: 500 }
    );
  }
}
