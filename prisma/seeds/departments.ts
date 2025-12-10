import { PrismaClient } from '@prisma/client';

export async function seedDepartments(prisma: PrismaClient) {
  console.log('Seeding Departments...');

  const departments = [
    { name: 'Information Technology', code: 'IT' },
    { name: 'Human Resources', code: 'HR' },
    { name: 'Finance & Accounting', code: 'FA' },
    { name: 'Operations', code: 'OPS' },
    { name: 'Marketing', code: 'MKT' },
    { name: 'Sales', code: 'SALES' },
    { name: 'Maintenance', code: 'MAINT' },
    { name: 'Facilities Management', code: 'FAC' },
    { name: 'Procurement', code: 'PROC' },
    { name: 'Quality Assurance', code: 'QA' },
  ];

  for (const department of departments) {
    const existingDepartment = await prisma.department.findFirst({
      where: { code: department.code },
    });

    if (!existingDepartment) {
      await prisma.department.create({
        data: department,
      });
      console.log(`✓ Created department: ${department.name}`);
    } else {
      console.log(`⊘ Department already exists: ${department.name}`);
    }
  }
}
