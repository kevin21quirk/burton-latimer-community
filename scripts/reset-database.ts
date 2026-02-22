import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetDatabase() {
  try {
    console.log('🗑️  Starting database cleanup...');

    // Delete all data in the correct order (respecting foreign key constraints)
    console.log('Deleting likes...');
    await prisma.like.deleteMany({});

    console.log('Deleting comments...');
    await prisma.comment.deleteMany({});

    console.log('Deleting posts...');
    await prisma.post.deleteMany({});

    console.log('Deleting messages...');
    await prisma.message.deleteMany({});

    console.log('Deleting group members...');
    await prisma.groupMember.deleteMany({});

    console.log('Deleting groups...');
    await prisma.group.deleteMany({});

    console.log('Deleting follows...');
    await prisma.follow.deleteMany({});

    console.log('Deleting users...');
    await prisma.user.deleteMany({});

    console.log('✅ Database cleaned successfully!');
    console.log('📊 All tables are now empty and ready for fresh data.');
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase()
  .then(() => {
    console.log('✨ Database reset complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to reset database:', error);
    process.exit(1);
  });
