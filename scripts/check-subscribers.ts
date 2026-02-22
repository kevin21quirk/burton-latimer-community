import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkSubscribers() {
  try {
    const subscribers = await prisma.user.findMany({
      where: { marketingConsent: true },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        marketingConsent: true,
        createdAt: true,
      },
    });

    console.log('\n=== NEWSLETTER SUBSCRIBERS ===\n');
    console.log(`Total subscribers: ${subscribers.length}\n`);

    if (subscribers.length > 0) {
      console.log('Users with marketingConsent = true:\n');
      subscribers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Created: ${user.createdAt.toLocaleDateString('en-GB')}`);
        console.log('');
      });
    } else {
      console.log('No subscribers found.');
    }

    console.log('\n=== END ===\n');
  } catch (error) {
    console.error('Error checking subscribers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSubscribers();
