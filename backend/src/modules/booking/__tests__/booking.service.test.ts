import { BookingService } from '../booking.service';
import { BookingRepository } from '../booking.repository';
import { BadRequestError, ConflictError } from '../../../shared/errors/AppError';
import { ErrorMessages } from '../../../shared/constants/enums';

jest.mock('../booking.repository');

describe('BookingService', () => {
  let bookingService: BookingService;
  let bookingRepository: jest.Mocked<BookingRepository>;

  beforeEach(() => {
    bookingRepository = new BookingRepository() as jest.Mocked<BookingRepository>;
    bookingService = new BookingService();
    (bookingService as any).bookingRepository = bookingRepository;
  });

  describe('createBooking', () => {
    it('should throw BadRequestError if dates are invalid (check-out before check-in)', async () => {
      await expect(bookingService.createBooking('user1', 'room1', '2026-01-20', '2026-01-19'))
        .rejects.toThrow(new BadRequestError('Check-out must be after check-in'));
    });

    it('should call repository with correct dates and return booking', async () => {
      const mockBooking = { id: 'b1', user_id: 'user1', room_id: 'room1' };
      bookingRepository.createWithTransaction.mockResolvedValue(mockBooking as any);

      const result = await bookingService.createBooking('user1', 'room1', '2026-01-20', '2026-01-22');

      expect(bookingRepository.createWithTransaction).toHaveBeenCalledWith(
        'user1',
        'room1',
        expect.any(Date),
        expect.any(Date),
        2
      );
      expect(result).toEqual(mockBooking);
    });

    it('should throw ConflictError if room is not available', async () => {
      bookingRepository.createWithTransaction.mockRejectedValue(new Error('Room is already booked or dates out of range'));

      await expect(bookingService.createBooking('user1', 'room1', '2026-01-20', '2026-01-21'))
        .rejects.toThrow(new ConflictError(ErrorMessages.ROOM_NOT_AVAILABLE));
    });
  });
});
