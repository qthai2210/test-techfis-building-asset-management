import { PrismaClient, Prisma } from '@prisma/client';

export async function seedEmployees(prisma: PrismaClient) {
  console.log('Seeding Employees...');

  // First get departments
  const it = await prisma.department.findFirst({ where: { code: 'IT' } });
  const hr = await prisma.department.findFirst({ where: { code: 'HR' } });
  const fa = await prisma.department.findFirst({ where: { code: 'FA' } });
  const ops = await prisma.department.findFirst({ where: { code: 'OPS' } });
  const maint = await prisma.department.findFirst({ where: { code: 'MAINT' } });

  const employees = [
    {
      employee_code: 'EMP001',
      full_name: 'Nguyễn Văn An',
      department_id: it!.id,
      position: 'System Administrator',
      phone: '0901234567',
      email: 'van.an@company.com',
      status: 'active',
    },
    {
      employee_code: 'EMP002',
      full_name: 'Trần Thị B',
      department_id: it!.id,
      position: 'Software Developer',
      phone: '0902345678',
      email: 'thi.b@company.com',
      status: 'active',
    },
    {
      employee_code: 'EMP003',
      full_name: 'Phạm Văn C',
      department_id: it!.id,
      position: 'Network Engineer',
      phone: '0903456789',
      email: 'van.c@company.com',
      status: 'active',
    },
    {
      employee_code: 'EMP004',
      full_name: 'Hoàng Thị D',
      department_id: hr!.id,
      position: 'HR Manager',
      phone: '0904567890',
      email: 'thi.d@company.com',
      status: 'active',
    },
    {
      employee_code: 'EMP005',
      full_name: 'Lê Văn E',
      department_id: fa!.id,
      position: 'Accountant',
      phone: '0905678901',
      email: 'van.e@company.com',
      status: 'active',
    },
    {
      employee_code: 'EMP006',
      full_name: 'Ngô Thị F',
      department_id: ops!.id,
      position: 'Operations Manager',
      phone: '0906789012',
      email: 'thi.f@company.com',
      status: 'active',
    },
    {
      employee_code: 'EMP007',
      full_name: 'Vũ Văn G',
      department_id: maint!.id,
      position: 'Maintenance Technician',
      phone: '0907890123',
      email: 'van.g@company.com',
      status: 'active',
    },
    {
      employee_code: 'EMP008',
      full_name: 'Đinh Thị H',
      department_id: maint!.id,
      position: 'Maintenance Technician',
      phone: '0908901234',
      email: 'thi.h@company.com',
      status: 'active',
    },
    {
      employee_code: 'EMP009',
      full_name: 'Bùi Văn I',
      department_id: it!.id,
      position: 'IT Support',
      phone: '0909012345',
      email: 'van.i@company.com',
      status: 'active',
    },
    {
      employee_code: 'EMP010',
      full_name: 'Dương Thị J',
      department_id: ops!.id,
      position: 'Senior Officer',
      phone: '0910123456',
      email: 'thi.j@company.com',
      status: 'active',
    },
  ];

  for (const employee of employees) {
    const existingEmployee = await prisma.employee.findFirst({
      where: { employee_code: employee.employee_code },
    });

    if (!existingEmployee) {
      await prisma.employee.create({
        data: employee as Prisma.EmployeeUncheckedCreateInput,
      });
      console.log(`✓ Created employee: ${employee.full_name}`);
    } else {
      console.log(`⊘ Employee already exists: ${employee.full_name}`);
    }
  }
}
