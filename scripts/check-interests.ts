import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== Checking User Interests ===\n');
  
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { firstName: { contains: 'Bruce', mode: 'insensitive' } },
        { firstName: { contains: 'Lisa', mode: 'insensitive' } }
      ]
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      interests: true
    }
  });

  users.forEach(u => {
    console.log(`${u.firstName} ${u.lastName}:`);
    console.log(`  ID: ${u.id}`);
    console.log(`  Interests: ${JSON.stringify(u.interests)}`);
    console.log('');
  });

  console.log('=== Checking Group Interests ===\n');
  
  const groups = await prisma.group.findMany({
    where: {
      name: { contains: 'Garden', mode: 'insensitive' }
    },
    select: {
      id: true,
      name: true,
      interests: true,
      status: true
    }
  });

  groups.forEach(g => {
    console.log(`${g.name}:`);
    console.log(`  ID: ${g.id}`);
    console.log(`  Status: ${g.status}`);
    console.log(`  Interests: ${JSON.stringify(g.interests)}`);
    console.log('');
  });
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
