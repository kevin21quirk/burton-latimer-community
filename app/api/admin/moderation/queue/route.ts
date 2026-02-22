import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Get moderation queue (admin only)
export async function GET(request: NextRequest) {
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

    // Get flagged posts
    const flaggedPosts = await prisma.post.findMany({
      where: {
        isFlagged: true,
        reviewedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            accountType: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
      orderBy: {
        flaggedAt: 'desc',
      },
    });

    // Get reports for each post
    const postsWithReports = await Promise.all(
      flaggedPosts.map(async (post) => {
        const reports = await prisma.report.findMany({
          where: {
            postId: post.id,
            status: 'PENDING',
          },
          include: {
            reporter: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        });

        return {
          ...post,
          reports,
        };
      })
    );

    return NextResponse.json(postsWithReports);
  } catch (error) {
    console.error("Error fetching moderation queue:", error);
    return NextResponse.json(
      { error: "Failed to fetch moderation queue" },
      { status: 500 }
    );
  }
}
