import prisma from '../../shared/utils/prisma';
import { BookingStatus, Prisma } from '@prisma/client';

export class BookingRepository {
  async createWithTransaction(
    userId: string,
    roomId: string,
    checkIn: Date,
    checkOut: Date,
    dayCount: number
  ) {
    return prisma.$transaction(async (tx) => {
      // 1. Lock and check availability
      // Prisma doesn't have a direct "FOR UPDATE" in findMany yet for all providers, 
      // but we can use raw SQL for the lock if needed, or rely on serializable isolation.
      // For PostgreSQL, we can use raw query for locking.
      
      const availabilityRows: any[] = await tx.$queryRaw`
        SELECT * FROM room_availability 
        WHERE room_id = ${roomId} AND date >= ${checkIn} AND date < ${checkOut} 
        FOR UPDATE
      `;

      if (availabilityRows.length !== dayCount) {
        throw new Error('Requested dates are outside of valid range');
      }

      const hasAvailability = availabilityRows.every(row => row.available_count > 0);
      if (!hasAvailability) {
        throw new Error('Room is already fully booked for one or more of the selected dates');
      }

      // 2. Decrement availability
      await tx.roomAvailability.updateMany({
        where: {
          room_id: roomId,
          date: {
            gte: checkIn,
            lt: checkOut,
          },
        },
        data: {
          available_count: {
            decrement: 1,
          },
        },
      });

      // 3. Create the booking record
      return tx.booking.create({
        data: {
          user_id: userId,
          room_id: roomId,
          check_in: checkIn,
          check_out: checkOut,
          status: BookingStatus.CONFIRMED,
        },
      });
    });
  }

  async findByUserId(userId: string) {
    return prisma.booking.findMany({
      where: { user_id: userId },
      include: {
        room: {
          select: {
            name: true,
            location: true,
            price_per_night: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }
}
