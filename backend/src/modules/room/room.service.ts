import { RoomRepository } from './room.repository';
import { NotFoundError, BadRequestError } from '../../shared/errors/AppError';

export class RoomService {
  private roomRepository: RoomRepository;

  constructor() {
    this.roomRepository = new RoomRepository();
  }

  async searchAvailableRooms(checkIn: string, checkOut: string, location?: string) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (start >= end) {
      throw new BadRequestError('Check-in must be before check-out');
    }

    const rooms = await this.roomRepository.findAllAvailable(start, end, location);
    
    // Map to include min availability
    return rooms.map(room => ({
      ...room,
      available_units: Math.min(...room.availability.map(a => a.available_count))
    }));
  }

  async getRoomDetails(id: string) {
    const room = await this.roomRepository.findById(id);
    if (!room) {
      throw new NotFoundError('Room not found');
    }
    return room;
  }
}
