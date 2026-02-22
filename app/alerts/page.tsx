import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AlertsClient from "@/components/alerts/AlertsClient";

export default async function AlertsPage() {
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
      isAdmin: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  // Get active alerts
  const alerts = await prisma.alert.findMany({
    where: {
      isActive: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gte: new Date() } },
      ],
    },
    include: {
      createdBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          accountType: true,
        },
      },
    },
    orderBy: [
      { priority: "desc" },
      { createdAt: "desc" },
    ],
  });

  return <AlertsClient user={user} alerts={alerts} />;
}
