import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixSubscribers() {
  try {
    console.log('\n=== FIXING NEWSLETTER SUBSCRIBERS ===\n');

    // Get all current subscribers
    const currentSubscribers = await prisma.user.findMany({
      where: { marketingConsent: true },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    console.log(`Found ${currentSubscribers.length} users with marketingConsent = true:\n`);
    currentSubscribers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`);
    });

    console.log('\n--- INSTRUCTIONS ---');
    console.log('This script will set marketingConsent = false for ALL users.');
    console.log('Then you can have the correct user opt-in through the profile settings.\n');

    // Set all users to false
    const result = await prisma.user.updateMany({
      where: { marketingConsent: true },
      data: { marketingConsent: false },
    });

    console.log(`✅ Updated ${result.count} users - all marketingConsent set to false\n`);
    console.log('Now have the correct user:');
    console.log('1. Log in to their account');
    console.log('2. Go to Profile → Privacy & Settings');
    console.log('3. Check "I would like to receive updates and news"');
    console.log('4. Click "Save Preferences"\n');

    // Verify
    const remainingSubscribers = await prisma.user.count({
      where: { marketingConsent: true },
    });

    console.log(`Current subscriber count: ${remainingSubscribers}`);
    console.log('\n=== DONE ===\n');
  } catch (error) {
    console.error('Error fixing subscribers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixSubscribers();
