import { Response, NextFunction } from 'express';
import { BookingService } from './booking.service';
import { AuthRequest } from '../../shared/middleware/authMiddleware';

const bookingService = new BookingService();

export const createBooking = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { roomId, checkIn, checkOut } = req.body;
    const userId = req.user!.id;

    const booking = await bookingService.createBooking(userId, roomId, checkIn, checkOut);
    res.status(201).json({
      message: 'Booking confirmed successfully',
      booking
    });
  } catch (error) {
    next(error);
  }
};

export const getUserBookings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const bookings = await bookingService.getMyBookings(userId);
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};
