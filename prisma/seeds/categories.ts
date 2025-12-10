import { PrismaClient } from '@prisma/client';

export async function seedCategories(prisma: PrismaClient) {
  console.log('Seeding Categories...');

  const categories = [
    { name: 'Computers', code: 'CAT-001' },
    { name: 'Office Furniture', code: 'CAT-002' },
    { name: 'Printers & Scanners', code: 'CAT-003' },
    { name: 'Networking Equipment', code: 'CAT-004' },
    { name: 'Storage Devices', code: 'CAT-005' },
    { name: 'Office Equipment', code: 'CAT-006' },
    { name: 'Machinery', code: 'CAT-007' },
    { name: 'Tools & Instruments', code: 'CAT-008' },
    { name: 'Vehicles', code: 'CAT-009' },
    { name: 'Security Equipment', code: 'CAT-010' },
  ];

  for (const category of categories) {
    const existingCategory = await prisma.category.findFirst({
      where: { code: category.code },
    });

    if (!existingCategory) {
      await prisma.category.create({
        data: category,
      });
      console.log(`✓ Created category: ${category.name}`);
    } else {
      console.log(`⊘ Category already exists: ${category.name}`);
    }
  }
}
