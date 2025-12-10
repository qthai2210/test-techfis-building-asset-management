import { PrismaClient, Prisma } from '@prisma/client';

export async function seedLocations(prisma: PrismaClient) {
  console.log('Seeding Locations...');

  const locations = [
    { floor: '1', room_name: 'Reception', type: 'lobby' },
    { floor: '1', room_name: 'Conference Room A', type: 'meeting_room' },
    { floor: '1', room_name: 'Conference Room B', type: 'meeting_room' },
    { floor: '1', room_name: 'IT Support', type: 'office' },
    { floor: '1', room_name: 'Storage Room 1', type: 'storage' },
    { floor: '2', room_name: 'IT Department', type: 'office' },
    { floor: '2', room_name: 'Development Lab', type: 'lab' },
    { floor: '2', room_name: 'Server Room', type: 'tech_room' },
    { floor: '2', room_name: 'Conference Room C', type: 'meeting_room' },
    { floor: '3', room_name: 'HR Department', type: 'office' },
    { floor: '3', room_name: 'Finance & Accounting', type: 'office' },
    { floor: '3', room_name: 'Management Offices', type: 'office' },
    { floor: '3', room_name: 'Conference Room D', type: 'meeting_room' },
    { floor: '4', room_name: 'Operations', type: 'office' },
    { floor: '4', room_name: 'Sales Department', type: 'office' },
    { floor: '4', room_name: 'Marketing', type: 'office' },
    { floor: 'B1', room_name: 'Parking', type: 'parking' },
    { floor: 'B1', room_name: 'Storage Room 2', type: 'storage' },
    { floor: 'B1', room_name: 'Maintenance Workshop', type: 'workshop' },
  ];

  for (const location of locations) {
    await prisma.location.create({
      data: location as Prisma.LocationUncheckedCreateInput,
    });
    console.log(`✓ Created location: Floor ${location.floor} - ${location.room_name}`);
  }
}
