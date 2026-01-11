import { Router } from 'express';
import * as roomController from '../controllers/roomController';
import { validate } from '../middleware/validationMiddleware';
import { searchRoomsSchema } from '../validators/schemas';

const router = Router();

router.get('/', validate(searchRoomsSchema), roomController.searchRooms);
router.get('/:id', roomController.getRoomById);

export default router;
