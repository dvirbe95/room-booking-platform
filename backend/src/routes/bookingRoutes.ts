import { Router } from 'express';
import { createBooking, getUserBookings } from '../controllers/bookingController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticateToken, createBooking);
router.get('/my-bookings', authenticateToken, getUserBookings);

export default router;
