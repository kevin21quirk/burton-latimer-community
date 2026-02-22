import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.error('❌ Please provide an email address');
    console.log('Usage: npx tsx scripts/make-admin.ts <email>');
    process.exit(1);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`❌ User with email ${email} not found`);
      process.exit(1);
    }

    if (user.isAdmin) {
      console.log(`ℹ️  User ${email} is already an admin`);
      process.exit(0);
    }

    await prisma.user.update({
      where: { email },
      data: { isAdmin: true },
    });

    console.log(`✅ Successfully made ${email} an admin!`);
    console.log(`🔐 ${user.firstName} ${user.lastName} now has full admin access`);
    console.log(`📍 Visit /admin to access the admin dashboard`);
  } catch (error) {
    console.error('❌ Error making user admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();
