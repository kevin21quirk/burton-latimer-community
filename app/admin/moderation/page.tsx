import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ModerationQueueClient from "@/components/admin/ModerationQueueClient";

export default async function ModerationPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      isAdmin: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  });

  if (!user?.isAdmin) {
    redirect("/dashboard");
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
      reports: {
        where: {
          status: "PENDING",
        },
        include: {
          reporter: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          comments: true,
          likes: true,
          reports: true,
        },
      },
    },
    orderBy: [
      { flaggedAt: "desc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <ModerationQueueClient
      user={user}
      flaggedPosts={flaggedPosts}
    />
  );
}
