import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await requireAuth();
    const { postId } = await params;

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: session.userId,
          postId: postId,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      return NextResponse.json({ message: "Post unliked" });
    } else {
      await prisma.like.create({
        data: {
          userId: session.userId,
          postId: postId,
        },
      });
      return NextResponse.json({ message: "Post liked" });
    }
  } catch (error) {
    console.error("Like post error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
