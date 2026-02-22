import { prisma } from "../lib/prisma";

async function checkMessages() {
  try {
    console.log("Checking all messages in database...\n");

    // Get all messages
    const allMessages = await prisma.message.findMany({
      include: {
        sender: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        receiver: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`Total messages in database: ${allMessages.length}\n`);

    if (allMessages.length === 0) {
      console.log("No messages found in database!");
      return;
    }

    // Show all messages
    allMessages.forEach((msg, index) => {
      console.log(`Message ${index + 1}:`);
      console.log(`  ID: ${msg.id}`);
      console.log(`  From: ${msg.sender.firstName} ${msg.sender.lastName} (${msg.sender.email})`);
      console.log(`  To: ${msg.receiver.firstName} ${msg.receiver.lastName} (${msg.receiver.email})`);
      console.log(`  Content: ${msg.content.substring(0, 50)}${msg.content.length > 50 ? '...' : ''}`);
      console.log(`  Read: ${msg.read}`);
      console.log(`  Created: ${msg.createdAt}`);
      console.log("");
    });

    // Count unread messages per user
    const unreadByUser = await prisma.message.groupBy({
      by: ["receiverId"],
      where: {
        read: false,
      },
      _count: {
        id: true,
      },
    });

    console.log("\nUnread messages by receiver:");
    for (const group of unreadByUser) {
      const user = await prisma.user.findUnique({
        where: { id: group.receiverId },
        select: { email: true, firstName: true, lastName: true },
      });
      console.log(`  ${user?.firstName} ${user?.lastName} (${user?.email}): ${group._count.id} unread`);
    }

  } catch (error) {
    console.error("Error checking messages:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMessages();
