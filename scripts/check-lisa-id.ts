import { prisma } from "../lib/prisma";

async function checkLisaId() {
  try {
    const lisa = await prisma.user.findUnique({
      where: { email: "lisa.loizidou@yellowbush.com" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    if (lisa) {
      console.log("Lisa's User Record:");
      console.log("  ID:", lisa.id);
      console.log("  Email:", lisa.email);
      console.log("  Name:", lisa.firstName, lisa.lastName);
      console.log("\nThis ID should match the userId in the JWT token when Lisa logs in.");
    } else {
      console.log("Lisa's account not found!");
    }

    // Check messages for this ID
    const messages = await prisma.message.findMany({
      where: {
        receiverId: lisa?.id,
      },
      select: {
        id: true,
        content: true,
        read: true,
        sender: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    console.log(`\nMessages for Lisa (receiverId: ${lisa?.id}):`);
    console.log(`Total: ${messages.length}`);
    messages.forEach((msg, i) => {
      console.log(`  ${i + 1}. From ${msg.sender.firstName} ${msg.sender.lastName} - Read: ${msg.read}`);
    });

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLisaId();
