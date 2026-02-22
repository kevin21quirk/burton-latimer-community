import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== Fixing Interests ===\n');
  
  // Update Lisa to have Gardening interest
  const lisa = await prisma.user.findFirst({
    where: {
      firstName: { contains: 'Lisa', mode: 'insensitive' },
      lastName: { contains: 'Loizidou', mode: 'insensitive' }
    }
  });

  if (lisa) {
    await prisma.user.update({
      where: { id: lisa.id },
      data: { interests: ['Gardening'] }
    });
    console.log('✅ Updated Lisa Loizidou to have Gardening interest');
  }

  // Update the APPROVED Gardening group
  const approvedGroup = await prisma.group.findFirst({
    where: {
      name: 'Gardening',
      status: 'APPROVED'
    }
  });

  if (approvedGroup) {
    await prisma.group.update({
      where: { id: approvedGroup.id },
      data: { interests: ['Gardening'] }
    });
    console.log('✅ Updated APPROVED Gardening group to have Gardening interest');
  }

  console.log('\n=== Verification ===\n');

  // Verify Lisa
  const updatedLisa = await prisma.user.findUnique({
    where: { id: lisa!.id },
    select: { firstName: true, lastName: true, interests: true }
  });
  console.log(`Lisa: ${JSON.stringify(updatedLisa?.interests)}`);

  // Verify Group
  const updatedGroup = await prisma.group.findUnique({
    where: { id: approvedGroup!.id },
    select: { name: true, status: true, interests: true }
  });
  console.log(`Gardening Group: ${JSON.stringify(updatedGroup?.interests)}`);
  console.log(`Status: ${updatedGroup?.status}`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
