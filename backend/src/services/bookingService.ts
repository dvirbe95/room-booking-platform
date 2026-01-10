import { getClient } from '../db';
import { BookingRepository } from '../repositories/bookingRepository';
import { AvailabilityRepository } from '../repositories/availabilityRepository';
import { BadRequestError, ConflictError } from '../errors/AppError';

export class BookingService {
  private bookingRepository: BookingRepository;
  private availabilityRepository: AvailabilityRepository;

  constructor() {
    this.bookingRepository = new BookingRepository();
    this.availabilityRepository = new AvailabilityRepository();
  }

  async createBooking(userId: string, roomId: string, checkIn: string, checkOut: string) {
    const client = await getClient();

    try {
      await client.query('BEGIN');

      const startDate = new Date(checkIn);
      const endDate = new Date(checkOut);
      const dayCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      if (dayCount <= 0) {
        throw new BadRequestError('Check-out must be after check-in');
      }

      // 1. Lock and check availability
      const availabilityRows = await this.availabilityRepository.getAndLockRange(
        client,
        roomId,
        checkIn,
        checkOut
      );

      if (availabilityRows.length !== dayCount) {
        throw new BadRequestError('Requested dates are outside of valid range');
      }

      const hasAvailability = availabilityRows.every(row => row.available_count > 0);
      if (!hasAvailability) {
        throw new ConflictError('Room is already fully booked for one or more of the selected dates');
      }

      // 2. Decrement availability
      await this.availabilityRepository.decrementRange(client, roomId, checkIn, checkOut);

      // 3. Create the booking record
      const booking = await this.bookingRepository.create(client, userId, roomId, checkIn, checkOut);

      await client.query('COMMIT');
      return booking;

    } catch (error) {
      await client.query('ROLLBACK');
      // Rethrow to be caught by global error handler
      throw error;
    } finally {
      client.release();
    }
  }

  async getMyBookings(userId: string) {
    return await this.bookingRepository.findByUserId(userId);
  }
}
