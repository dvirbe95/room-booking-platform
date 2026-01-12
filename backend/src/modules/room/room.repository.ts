import prisma from '../../shared/utils/prisma';

export class RoomRepository {
  async findAllAvailable(checkIn: Date, checkOut: Date, location?: string) {
    return prisma.room.findMany({
      where: {
        location: location ? { contains: location, mode: 'insensitive' } : undefined,
        availability: {
          some: {
            date: {
              gte: checkIn,
              lt: checkOut,
            },
            available_count: {
              gt: 0,
            },
          },
        },
      },
      include: {
        availability: {
          where: {
            date: {
              gte: checkIn,
              lt: checkOut,
            },
          },
          select: {
            available_count: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.room.findUnique({
      where: { id },
    });
  }

  async create(data: { name: string; description?: string; price_per_night: number; location: string; total_inventory: number }) {
    return prisma.$transaction(async (tx) => {
      // 1. Create the room (Prisma/DB generates the UUID id automatically)
      const room = await tx.room.create({
        data,
      });

      // 2. Initialize availability for the next 30 days
      const availabilityData = [];
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        date.setHours(0, 0, 0, 0);

        availabilityData.push({
          room_id: room.id,
          date: date,
          available_count: room.total_inventory,
        });
      }

      await tx.roomAvailability.createMany({
        data: availabilityData,
      });

      return room;
    });
  }
}
