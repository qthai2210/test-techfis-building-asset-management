import { PrismaClient, Prisma } from '@prisma/client';

export async function seedMaintenanceRecords(prisma: PrismaClient) {
  console.log('Seeding Maintenance Records...');

  // Get assets and suppliers
  const assets = await prisma.asset.findMany({ take: 5 });
  const supplier = await prisma.supplier.findFirst();

  const maintenanceRecords = [
    {
      asset_id: assets[0]?.id,
      supplier_id: supplier?.id,
      maintenance_date: new Date('2024-01-15'),
      type: 'inspection',
      cost: 500000,
      details: 'Quarterly maintenance inspection - All systems normal',
    },
    {
      asset_id: assets[1]?.id,
      supplier_id: supplier?.id,
      maintenance_date: new Date('2024-02-20'),
      type: 'maintenance',
      cost: 1500000,
      details: 'Cleaning and dust removal from cooling vents',
    },
    {
      asset_id: assets[3]?.id,
      supplier_id: supplier?.id,
      maintenance_date: new Date('2024-03-10'),
      type: 'repair',
      cost: 3500000,
      details: 'Replaced toner cartridge and rollers - Paper jam issue resolved',
    },
    {
      asset_id: assets[4]?.id,
      supplier_id: supplier?.id,
      maintenance_date: new Date('2024-01-25'),
      type: 'inspection',
      cost: 800000,
      details: 'Network equipment inspection - Firmware updated',
    },
    {
      asset_id: assets[2]?.id,
      supplier_id: supplier?.id,
      maintenance_date: new Date('2024-04-05'),
      type: 'maintenance',
      cost: 1200000,
      details: 'Surface cleaning and polish - No structural issues',
    },
    {
      asset_id: assets[0]?.id,
      supplier_id: supplier?.id,
      maintenance_date: new Date('2024-04-15'),
      type: 'maintenance',
      cost: 2000000,
      details: 'Battery replacement and keyboard cleaning',
    },
    {
      asset_id: assets[3]?.id,
      supplier_id: supplier?.id,
      maintenance_date: new Date('2024-04-22'),
      type: 'inspection',
      cost: 600000,
      details: 'Post-repair inspection - All functions working properly',
    },
  ];

  for (const record of maintenanceRecords) {
    if (record.asset_id) {
      await prisma.maintenanceRecord.create({
        data: record as Prisma.MaintenanceRecordUncheckedCreateInput,
      });
      console.log(
        `✓ Created maintenance record for asset ID ${record.asset_id} - ${record.type}`
      );
    }
  }
}
