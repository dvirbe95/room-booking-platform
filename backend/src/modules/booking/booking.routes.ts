import { Router } from 'express';
import * as bookingController from './booking.controller';
import { authenticateToken } from '../../shared/middleware/authMiddleware';
import { validate } from '../../shared/middleware/validationMiddleware';
import { createBookingSchema } from '../../shared/utils/schemas';
import { authorize } from '../../shared/middleware/roleMiddleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticateToken);

router.post(
  '/', 
  authorize(Role.USER, Role.ADMIN), 
  validate(createBookingSchema), 
  bookingController.createBooking
);

router.get(
  '/my-bookings', 
  authorize(Role.USER, Role.ADMIN), 
  bookingController.getUserBookings
);

export default router;
