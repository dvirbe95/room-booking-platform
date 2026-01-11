import { Router } from 'express';
import * as bookingController from '../controllers/bookingController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validate } from '../middleware/validationMiddleware';
import { createBookingSchema } from '../validators/schemas';
import { authorize } from '../middleware/roleMiddleware';

const router = Router();

router.use(authenticateToken);

router.post(
  '/', 
  authorize('user', 'admin'), 
  validate(createBookingSchema), 
  bookingController.createBooking
);

router.get(
  '/my-bookings', 
  authorize('user', 'admin'), 
  bookingController.getUserBookings
);

export default router;
