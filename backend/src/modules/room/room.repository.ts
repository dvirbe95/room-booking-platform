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
}
