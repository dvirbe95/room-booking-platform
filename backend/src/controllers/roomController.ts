import { Request, Response, NextFunction } from 'express';
import { RoomService } from '../services/roomService';

const roomService = new RoomService();

export const searchRooms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { checkIn, checkOut, location } = req.query;
    const rooms = await roomService.searchAvailableRooms(
      checkIn as string,
      checkOut as string,
      location as string
    );
    res.json(rooms);
  } catch (error) {
    next(error);
  }
};

export const getRoomById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const room = await roomService.getRoomDetails(id);
    res.json(room);
  } catch (error) {
    next(error);
  }
};
