import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌌 Seeding admin user...');

  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('JeoArgentina*2026', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@jovenesenorbita.com',
      passwordHash,
      name: 'Director JEO',
      role: 'SUPERADMIN',
    },
  });

  console.log(`👤 Main admin user seeded: ${adminUser.email}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


