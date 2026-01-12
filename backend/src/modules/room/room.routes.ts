import { Router } from 'express';
import * as roomController from './room.controller';
import { searchRoomsSchema, createRoomSchema } from '../../shared/utils/schemas';
import { validate } from '../../shared/middleware/validationMiddleware';
import { authenticateToken } from '../../shared/middleware/authMiddleware';
import { authorize } from '../../shared/middleware/roleMiddleware';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', validate(searchRoomsSchema), roomController.searchRooms);
router.get('/:id', roomController.getRoomById);

router.post(
  '/',
  authenticateToken,
  authorize(Role.ADMIN),
  validate(createRoomSchema),
  roomController.createRoom
);

export default router;
