import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      accountType: true,
      profileImage: true,
      bio: true,
    },
  });

  const posts = await prisma.post.findMany({
    take: 20,
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

  if (!user) {
    redirect("/login");
  }

  return <DashboardClient user={user} initialPosts={posts} />;
}
