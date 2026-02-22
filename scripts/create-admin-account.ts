import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdminAccount() {
  const email = 'kevin.s.quirk@gmail.com';
  const password = 'a15Dz6fl!';
  const firstName = 'Kevin';
  const lastName = 'Quirk';

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`ℹ️  User ${email} already exists`);
      
      // Update to admin if not already
      if (!existingUser.isAdmin) {
        await prisma.user.update({
          where: { email },
          data: { isAdmin: true },
        });
        console.log(`✅ Granted admin privileges to ${email}`);
      } else {
        console.log(`✅ ${email} is already an admin`);
      }
      
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the admin user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        accountType: 'INDIVIDUAL',
        gdprConsent: true,
        marketingConsent: false,
        isAdmin: true,
      },
    });

    console.log(`✅ Successfully created admin account!`);
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Name: ${firstName} ${lastName}`);
    console.log(`🔐 Admin privileges: GRANTED`);
    console.log(`📍 You can now login at /login and access /admin`);
  } catch (error) {
    console.error('❌ Error creating admin account:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminAccount();
