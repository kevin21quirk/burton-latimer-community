import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { moderateText, calculateUserRiskScore } from "@/lib/moderation";

// Moderate post content before creation
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, images } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Get user info for risk scoring
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        createdAt: true,
        isAdmin: true,
        accountType: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Moderate text content
    const textModeration = moderateText(content);
    
    // Calculate user risk score
    const userRiskScore = calculateUserRiskScore(user);
    
    // Combine scores
    const totalRiskScore = textModeration.riskScore + userRiskScore;

    // Determine if content should be blocked
    if (textModeration.isBlocked) {
      return NextResponse.json({
        allowed: false,
        blocked: true,
        reason: "Content contains prohibited material",
        flags: textModeration.flags,
        riskScore: totalRiskScore,
      }, { status: 403 });
    }

    // Determine if content needs manual review
    const needsReview = totalRiskScore >= 40;

    return NextResponse.json({
      allowed: true,
      blocked: false,
      needsReview,
      riskScore: totalRiskScore,
      flags: textModeration.flags,
      warnings: textModeration.warnings,
    });
  } catch (error) {
    console.error("Error moderating content:", error);
    return NextResponse.json(
      { error: "Failed to moderate content" },
      { status: 500 }
    );
  }
}
