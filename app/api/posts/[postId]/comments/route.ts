import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token.value, JWT_SECRET);
    const userId = payload.userId as string;

    const { content } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    // Create the comment
    await prisma.comment.create({
      data: {
        content: content.trim(),
        userId,
        postId: params.postId,
      },
    });

    // Fetch the updated post with all relations
    const updatedPost = await prisma.post.findUnique({
      where: { id: params.postId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            accountType: true,
            profileImage: true,
            companyName: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}
