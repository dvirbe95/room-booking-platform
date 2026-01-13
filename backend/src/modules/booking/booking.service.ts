import { BookingRepository } from './booking.repository';
import { BadRequestError, ConflictError } from '../../shared/errors/AppError';
import { ErrorMessages } from '../../shared/constants/enums';

export class BookingService {
  private bookingRepository: BookingRepository;

  constructor() {
    this.bookingRepository = new BookingRepository();
  }

  async createBooking(userId: string, roomId: string, checkIn: string, checkOut: string) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const dayCount = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (dayCount <= 0) {
      throw new BadRequestError('Check-out must be after check-in');
    }

    try {
      return await this.bookingRepository.createWithTransaction(
        userId,
        roomId,
        start,
        end,
        dayCount
      );
    } catch (error: any) {
      if (error.message.includes('booked') || error.message.includes('range')) {
        throw new ConflictError(ErrorMessages.ROOM_NOT_AVAILABLE);
      }
      throw error;
    }
  }

  async getMyBookings(userId: string) {
    return await this.bookingRepository.findByUserId(userId);
  }
}
