import { PrismaClient } from '@prisma/client';

export async function seedSuppliers(prisma: PrismaClient) {
  console.log('Seeding Suppliers...');

  const suppliers = [
    {
      name: 'Tech Supplies Co.',
      contact_person: 'John Smith',
      phone: '0912345678',
      email: 'john@techsupplies.com',
      address: '123 Tech Street, District 1, HCMC',
      note: 'Reliable supplier for office equipment',
    },
    {
      name: 'Industrial Solutions Ltd',
      contact_person: 'Mary Johnson',
      phone: '0923456789',
      email: 'mary@industrialsol.com',
      address: '456 Industrial Ave, District 2, HCMC',
      note: 'Specialized in heavy equipment',
    },
    {
      name: 'Office Essentials Inc',
      contact_person: 'David Brown',
      phone: '0934567890',
      email: 'david@officeess.com',
      address: '789 Business Blvd, District 3, HCMC',
      note: 'General office supplies and furniture',
    },
    {
      name: 'Electronic Distributors',
      contact_person: 'Lisa Chen',
      phone: '0945678901',
      email: 'lisa@electronics.com',
      address: '321 Tech Park, District 4, HCMC',
      note: 'Electronics and IT equipment',
    },
    {
      name: 'Maintenance Services Pro',
      contact_person: 'Robert Wilson',
      phone: '0956789012',
      email: 'robert@maintpro.com',
      address: '654 Service Road, District 5, HCMC',
      note: 'Maintenance and repair services',
    },
  ];

  for (const supplier of suppliers) {
    const existingSupplier = await prisma.supplier.findFirst({
      where: { email: supplier.email },
    });

    if (!existingSupplier) {
      await prisma.supplier.create({
        data: supplier,
      });
      console.log(`✓ Created supplier: ${supplier.name}`);
    } else {
      console.log(`⊘ Supplier already exists: ${supplier.name}`);
    }
  }
}
