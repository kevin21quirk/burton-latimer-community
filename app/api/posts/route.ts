import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

const createPostSchema = z.object({
  content: z.string().min(1),
  postType: z.enum(["GENERAL", "HELP_REQUEST", "BUSINESS_AD", "EVENT"]).default("GENERAL"),
  images: z.array(z.string()).optional(),
  video: z.string().nullable().optional(),
  groupId: z.string().nullable().optional(),
  riskScore: z.number().optional(),
  isFlagged: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const data = createPostSchema.parse(body);

    const post = await prisma.post.create({
      data: {
        content: data.content,
        postType: data.postType,
        images: data.images || [],
        video: data.video || null,
        userId: session.userId,
        groupId: data.groupId || null,
        riskScore: data.riskScore || 0,
        isFlagged: data.isFlagged || false,
        flaggedAt: data.isFlagged ? new Date() : null,
      },
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
          select: {
            id: true,
          },
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid data", errors: error.issues },
        { status: 400 }
      );
    }

    console.error("Create post error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const posts = await prisma.post.findMany({
      where: {
        isHidden: false,
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
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
          select: {
            id: true,
          },
        },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Get posts error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
