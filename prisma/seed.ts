import { seedSuppliers } from './seeds/suppliers';
import { seedCategories } from './seeds/categories';
import { seedDepartments } from './seeds/departments';
import { seedLocations } from './seeds/locations';
import { seedEmployees } from './seeds/employees';
import { seedAccounts } from './seeds/accounts';
import { seedAssets } from './seeds/assets';
import { seedMaintenanceRecords } from './seeds/maintenance-records';
import { seedAssetHistory } from './seeds/asset-history';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { createPrismaAdapter } from './config';

dotenv.config();

const prisma = new PrismaClient({ adapter: createPrismaAdapter() });

async function main() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Seed in order of dependencies
    await seedSuppliers(prisma);
    await seedCategories(prisma);
    await seedDepartments(prisma);
    await seedLocations(prisma);
    await seedEmployees(prisma);
    await seedAccounts(prisma);
    await seedAssets(prisma);
    await seedMaintenanceRecords(prisma);
    await seedAssetHistory(prisma);

    console.log('\n✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
