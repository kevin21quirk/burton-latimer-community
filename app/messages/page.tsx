import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MessagesClient from "@/components/messages/MessagesClient";

export default async function MessagesPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      profileImage: true,
    },
  });

  const conversations = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: session.userId },
        { receiverId: session.userId },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: {
      sender: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
        },
      },
      receiver: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
        },
      },
    },
  });

  const users = await prisma.user.findMany({
    where: {
      NOT: { id: session.userId },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      profileImage: true,
      accountType: true,
    },
    take: 20,
  });

  if (!user) {
    redirect("/login");
  }

  return <MessagesClient user={user} conversations={conversations} users={users} />;
}
