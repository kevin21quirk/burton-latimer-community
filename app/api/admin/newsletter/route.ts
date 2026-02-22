import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { isAdmin: true },
    });

    if (!user?.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    // Get all newsletters ordered by most recent first
    const newsletters = await prisma.newsletter.findMany({
      orderBy: { sentAt: "desc" },
      include: {
        sentBy: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ newsletters });
  } catch (error) {
    console.error("Newsletter fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch newsletters" },
      { status: 500 }
    );
  }
}

const newsletterSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Content is required"),
  htmlContent: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { isAdmin: true },
    });

    if (!user?.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { subject, content, htmlContent, images } = newsletterSchema.parse(body);

    // Get all users who opted in for marketing communications
    const subscribers = await prisma.user.findMany({
      where: { marketingConsent: true },
      select: {
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: "No subscribers found" },
        { status: 400 }
      );
    }

    // TODO: Integrate with your email service provider (e.g., SendGrid, Mailchimp, AWS SES)
    // For now, we'll just log it
    console.log(`Newsletter to be sent to ${subscribers.length} subscribers:`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${content}`);
    console.log(`Recipients:`, subscribers.map(s => s.email));

    // Example integration with a hypothetical email service:
    // await emailService.sendBulkEmail({
    //   from: 'newsletter@burtonlatimer.com',
    //   subject: subject,
    //   recipients: subscribers.map(s => ({
    //     email: s.email,
    //     name: `${s.firstName} ${s.lastName}`,
    //   })),
    //   html: htmlContent || content,
    // });

    // Save newsletter to database
    const newsletter = await prisma.newsletter.create({
      data: {
        subject,
        content,
        htmlContent: htmlContent || null,
        images: images || [],
        subscriberCount: subscribers.length,
        sentById: session.userId,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Newsletter sent to ${subscribers.length} subscribers`,
      subscriberCount: subscribers.length,
      newsletterId: newsletter.id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Newsletter send error:", error);
    return NextResponse.json(
      { error: "Failed to send newsletter" },
      { status: 500 }
    );
  }
}
