import { Router } from 'express';
import { searchRooms, getRoomById } from '../controllers/roomController';

const router = Router();

router.get('/', searchRooms);
router.get('/:id', getRoomById);

export default router;
