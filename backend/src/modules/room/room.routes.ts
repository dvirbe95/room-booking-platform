import { Router } from 'express';
import * as roomController from './room.controller';
import { searchRoomsSchema } from '../../shared/utils/schemas';
import { validate } from '../../shared/middleware/validationMiddleware';

const router = Router();

router.get('/', validate(searchRoomsSchema), roomController.searchRooms);
router.get('/:id', roomController.getRoomById);

export default router;
