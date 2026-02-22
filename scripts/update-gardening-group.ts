import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Find the Gardening group
  const gardeningGroup = await prisma.group.findFirst({
    where: {
      name: {
        contains: 'Gardening',
        mode: 'insensitive',
      },
    },
  });

  if (!gardeningGroup) {
    console.log('Gardening group not found');
    return;
  }

  console.log('Found Gardening group:', gardeningGroup.name);

  // Update the group to add interests
  const updated = await prisma.group.update({
    where: { id: gardeningGroup.id },
    data: {
      interests: ['Gardening'],
    },
  });

  console.log('Updated group interests:', updated.interests);
  console.log('✅ Gardening group now has interests set!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
