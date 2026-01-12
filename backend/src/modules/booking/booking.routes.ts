import { Router } from 'express';
import { Role } from '@prisma/client';
import * as bookingController from './booking.controller';
import { createBookingSchema } from '../../shared/utils/schemas';
import { authorize } from '../../shared/middleware/roleMiddleware';
import { validate } from '../../shared/middleware/validationMiddleware';
import { authenticateToken } from '../../shared/middleware/authMiddleware';

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
