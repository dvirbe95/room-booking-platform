import { Router } from 'express';
import * as roomController from './room.controller';
import { validate } from '../../shared/middleware/validationMiddleware';
import { searchRoomsSchema } from '../../shared/utils/schemas';

const router = Router();

router.get('/', validate(searchRoomsSchema), roomController.searchRooms);
router.get('/:id', roomController.getRoomById);

export default router;
