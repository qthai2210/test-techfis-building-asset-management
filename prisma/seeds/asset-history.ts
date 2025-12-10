import { PrismaClient, Prisma } from '@prisma/client';

export async function seedAssetHistory(prisma: PrismaClient) {
  console.log('Seeding Asset History...');

  // Get assets and employees
  const assets = await prisma.asset.findMany({ take: 5 });
  const employees = await prisma.employee.findMany({ take: 3 });

  const assetHistories = [
    {
      asset_id: assets[0]?.id,
      action_type: 'created',
      action_date: new Date('2023-01-15'),
      from_employee_id: null,
      to_employee_id: null,
      description: 'Asset created and added to inventory',
    },
    {
      asset_id: assets[0]?.id,
      action_type: 'assigned',
      action_date: new Date('2023-01-20'),
      from_employee_id: null,
      to_employee_id: employees[0]?.id,
      description: 'Assigned to employee',
    },
    {
      asset_id: assets[0]?.id,
      action_type: 'repaired',
      action_date: new Date('2024-01-15'),
      from_employee_id: null,
      to_employee_id: null,
      description: 'Quarterly maintenance completed',
    },
    {
      asset_id: assets[1]?.id,
      action_type: 'created',
      action_date: new Date('2022-06-20'),
      from_employee_id: null,
      to_employee_id: null,
      description: 'Asset created and added to inventory',
    },
    {
      asset_id: assets[2]?.id,
      action_type: 'created',
      action_date: new Date('2021-03-10'),
      from_employee_id: null,
      to_employee_id: null,
      description: 'Furniture purchased and registered',
    },
    {
      asset_id: assets[3]?.id,
      action_type: 'created',
      action_date: new Date('2022-09-05'),
      from_employee_id: null,
      to_employee_id: null,
      description: 'Multifunction printer acquired',
    },
    {
      asset_id: assets[3]?.id,
      action_type: 'transferred',
      action_date: new Date('2023-06-01'),
      from_employee_id: employees[0]?.id,
      to_employee_id: employees[1]?.id,
      description: 'Transferred from IT to Marketing department',
    },
    {
      asset_id: assets[3]?.id,
      action_type: 'repaired',
      action_date: new Date('2024-03-10'),
      from_employee_id: null,
      to_employee_id: null,
      description: 'Major repair: toner cartridge and rollers replaced',
    },
    {
      asset_id: assets[4]?.id,
      action_type: 'created',
      action_date: new Date('2023-02-14'),
      from_employee_id: null,
      to_employee_id: null,
      description: 'Network equipment installed',
    },
  ];

  for (const history of assetHistories) {
    if (history.asset_id) {
      await prisma.assetHistory.create({
        data: history as Prisma.AssetHistoryUncheckedCreateInput,
      });
      console.log(
        `✓ Created history record for asset ID ${history.asset_id} - ${history.action_type}`
      );
    }
  }
}
