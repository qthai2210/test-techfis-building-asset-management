import { PrismaClient, Prisma } from '@prisma/client';
import * as crypto from 'crypto';

// Simple hash function (in production, use bcrypt)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function seedAccounts(prisma: PrismaClient) {
  console.log('Seeding Accounts...');

  // Get some employees
  const employees = await prisma.employee.findMany({ take: 5 });

  const accounts = employees.map((emp, index) => ({
    username: `user${String(index + 1).padStart(3, '0')}`,
    password_hash: hashPassword('password123'),
    role: index === 0 ? 'admin' : index < 2 ? 'manager' : 'user',
    employee_id: emp.id,
  }));

  for (const account of accounts) {
    const existingAccount = await prisma.account.findFirst({
      where: { username: account.username },
    });

    if (!existingAccount) {
      await prisma.account.create({
        data: account as Prisma.AccountUncheckedCreateInput,
      });
      console.log(`✓ Created account: ${account.username} (role: ${account.role})`);
    } else {
      console.log(`⊘ Account already exists: ${account.username}`);
    }
  }
}
