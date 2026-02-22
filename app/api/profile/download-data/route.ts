import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();

    // Fetch all user data
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        posts: {
          select: {
            id: true,
            content: true,
            postType: true,
            createdAt: true,
            images: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
        },
        sentMessages: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            receiverId: true,
          },
        },
        receivedMessages: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            senderId: true,
          },
        },
        groupMemberships: {
          select: {
            group: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
            joinedAt: true,
          },
        },
        connectionRequests: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            addresseeId: true,
          },
        },
        connectionReceived: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            requesterId: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Format the data for download
    const userData = {
      profile: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        accountType: user.accountType,
        dateOfBirth: user.dateOfBirth,
        phoneNumber: user.phoneNumber,
        address: user.address,
        city: user.city,
        postcode: user.postcode,
        companyName: user.companyName,
        charityName: user.charityName,
        charityNumber: user.charityNumber,
        bio: user.bio,
        interests: user.interests,
        marketingConsent: user.marketingConsent,
        createdAt: user.createdAt,
      },
      posts: user.posts,
      comments: user.comments,
      messages: {
        sent: user.sentMessages,
        received: user.receivedMessages,
      },
      groups: user.groupMemberships,
      connections: {
        sent: user.connectionRequests,
        received: user.connectionReceived,
      },
      exportDate: new Date().toISOString(),
    };

    // Return as JSON file
    return new NextResponse(JSON.stringify(userData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="burton-latimer-data-${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (error) {
    console.error("Download data error:", error);
    return NextResponse.json(
      { error: "Failed to download data" },
      { status: 500 }
    );
  }
}
