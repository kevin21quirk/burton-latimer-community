import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import LocalServicesClient from "@/components/local-services/LocalServicesClient";

export default async function LocalServicesPage() {
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

  // Get all local services
  const services = await prisma.localService.findMany({
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
      { isVerified: "desc" },
      { createdAt: "desc" },
    ],
  });

  return <LocalServicesClient user={user} services={services} />;
}
