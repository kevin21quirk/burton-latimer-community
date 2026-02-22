import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Flag a post for moderation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await params;
    const { reason, details } = await request.json();

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Create report
    await prisma.report.create({
      data: {
        reason: reason || "OTHER",
        details: details || "",
        reporterId: session.userId,
        reportedId: post.userId,
        postId: postId,
        status: "PENDING",
      },
    });

    // Flag the post
    await prisma.post.update({
      where: { id: postId },
      data: {
        isFlagged: true,
        flaggedAt: new Date(),
      },
    });

    // Check if post has multiple reports - auto-hide if >= 3 reports
    const reportCount = await prisma.report.count({
      where: {
        postId: postId,
        status: "PENDING",
      },
    });

    if (reportCount >= 3) {
      await prisma.post.update({
        where: { id: postId },
        data: {
          isHidden: true,
          moderationNotes: `Auto-hidden due to ${reportCount} reports`,
        },
      });
    }

    return NextResponse.json({ 
      success: true,
      message: "Post reported successfully. Our moderation team will review it.",
    });
  } catch (error) {
    console.error("Error flagging post:", error);
    return NextResponse.json(
      { error: "Failed to flag post" },
      { status: 500 }
    );
  }
}
