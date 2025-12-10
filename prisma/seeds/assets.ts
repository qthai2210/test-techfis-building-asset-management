import { PrismaClient, Prisma } from '@prisma/client';

export async function seedAssets(prisma: PrismaClient) {
  console.log('Seeding Assets...');

  // Get related data
  const computerCategory = await prisma.category.findFirst({ where: { code: 'CAT-001' } });
  const furnitureCategory = await prisma.category.findFirst({ where: { code: 'CAT-002' } });
  const printerCategory = await prisma.category.findFirst({ where: { code: 'CAT-003' } });
  const networkCategory = await prisma.category.findFirst({ where: { code: 'CAT-004' } });

  const supplier1 = await prisma.supplier.findFirst();
  const supplier2 = await prisma.supplier.findMany({ take: 2 });

  const location1 = await prisma.location.findFirst();
  const locations = await prisma.location.findMany({ take: 5 });

  const employee1 = await prisma.employee.findFirst();

  const assets = [
    {
      asset_code: 'AST-001',
      name: 'Dell Latitude 5520 Laptop',
      category_id: computerCategory!.id,
      supplier_id: supplier1?.id,
      status: 'active',
      location_id: locations[0]?.id,
      assigned_employee_id: employee1?.id,
      purchase_price: 15000000,
      purchase_date: new Date('2023-01-15'),
      warranty_expiry_date: new Date('2025-01-15'),
      model: 'Latitude 5520',
      serial_number: 'DL-5520-2023-001',
      image_url: null,
      current_note: 'Recently upgraded with 16GB RAM',
    },
    {
      asset_code: 'AST-002',
      name: 'HP ProDesk 400 Desktop',
      category_id: computerCategory!.id,
      supplier_id: supplier2[0]?.id,
      status: 'active',
      location_id: locations[1]?.id,
      assigned_employee_id: null,
      purchase_price: 12000000,
      purchase_date: new Date('2022-06-20'),
      warranty_expiry_date: new Date('2024-06-20'),
      model: 'ProDesk 400 G9',
      serial_number: 'HP-PDK400-2022-001',
      image_url: null,
      current_note: 'Office desktop for shared use',
    },
    {
      asset_code: 'AST-003',
      name: 'Office Desk - Executive',
      category_id: furnitureCategory!.id,
      supplier_id: supplier1?.id,
      status: 'active',
      location_id: locations[2]?.id,
      assigned_employee_id: null,
      purchase_price: 5000000,
      purchase_date: new Date('2021-03-10'),
      warranty_expiry_date: new Date('2026-03-10'),
      model: 'Executive Oak',
      serial_number: 'DESK-EXC-2021-001',
      image_url: null,
      current_note: 'Management office furniture',
    },
    {
      asset_code: 'AST-004',
      name: 'Xerox VersaLink C405 Printer',
      category_id: printerCategory!.id,
      supplier_id: supplier2[1]?.id,
      status: 'active',
      location_id: locations[3]?.id,
      assigned_employee_id: null,
      purchase_price: 25000000,
      purchase_date: new Date('2022-09-05'),
      warranty_expiry_date: new Date('2025-09-05'),
      model: 'VersaLink C405',
      serial_number: 'XRX-VLC405-2022-001',
      image_url: null,
      current_note: 'Color multifunction printer for department',
    },
    {
      asset_code: 'AST-005',
      name: 'Cisco Catalyst 2960 Switch',
      category_id: networkCategory!.id,
      supplier_id: supplier1?.id,
      status: 'active',
      location_id: locations[4]?.id,
      assigned_employee_id: null,
      purchase_price: 8000000,
      purchase_date: new Date('2023-02-14'),
      warranty_expiry_date: new Date('2026-02-14'),
      model: 'Catalyst 2960-X',
      serial_number: 'CSC-CAT2960X-2023-001',
      image_url: null,
      current_note: 'Network switch for server room',
    },
    {
      asset_code: 'AST-006',
      name: 'Office Chair - Ergonomic',
      category_id: furnitureCategory!.id,
      supplier_id: supplier2[0]?.id,
      status: 'active',
      location_id: locations[1]?.id,
      assigned_employee_id: null,
      purchase_price: 2500000,
      purchase_date: new Date('2022-11-30'),
      warranty_expiry_date: new Date('2027-11-30'),
      model: 'Ergonomic Pro Max',
      serial_number: 'CHAIR-EGO-2022-001',
      image_url: null,
      current_note: 'Ergonomic seating for office',
    },
    {
      asset_code: 'AST-007',
      name: 'Canon imageRUNNER 2520 Copier',
      category_id: printerCategory!.id,
      supplier_id: supplier1?.id,
      status: 'under_maintenance',
      location_id: locations[0]?.id,
      assigned_employee_id: null,
      purchase_price: 35000000,
      purchase_date: new Date('2021-05-20'),
      warranty_expiry_date: new Date('2024-05-20'),
      model: 'imageRUNNER 2520',
      serial_number: 'CAN-IMG2520-2021-001',
      image_url: null,
      current_note: 'Currently under maintenance contract',
    },
    {
      asset_code: 'AST-008',
      name: 'Samsung Evo 870 SSD 1TB',
      category_id: computerCategory!.id,
      supplier_id: supplier2[1]?.id,
      status: 'active',
      location_id: locations[3]?.id,
      assigned_employee_id: null,
      purchase_price: 3000000,
      purchase_date: new Date('2023-04-10'),
      warranty_expiry_date: new Date('2026-04-10'),
      model: 'Evo 870 1TB',
      serial_number: 'SAM-EVO870-2023-001',
      image_url: null,
      current_note: 'Storage upgrade for backup system',
    },
  ];

  for (const asset of assets) {
    const existingAsset = await prisma.asset.findFirst({
      where: { asset_code: asset.asset_code },
    });

    if (!existingAsset) {
      await prisma.asset.create({
        data: asset as Prisma.AssetUncheckedCreateInput,
      });
      console.log(`✓ Created asset: ${asset.name}`);
    } else {
      console.log(`⊘ Asset already exists: ${asset.name}`);
    }
  }
}
