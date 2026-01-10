import { RoomRepository } from '../repositories/roomRepository';
import { NotFoundError } from '../errors/AppError';

export class RoomService {
  private roomRepository: RoomRepository;

  constructor() {
    this.roomRepository = new RoomRepository();
  }

  async searchAvailableRooms(checkIn: string, checkOut: string, location?: string) {
    // Basic date validation - though Zod will handle the heavy lifting later
    if (new Date(checkIn) >= new Date(checkOut)) {
      throw new Error('Check-in must be before check-out');
    }

    return await this.roomRepository.findAllAvailable(checkIn, checkOut, location);
  }

  async getRoomDetails(id: string) {
    const room = await this.roomRepository.findById(id);
    if (!room) {
      throw new NotFoundError('Room not found');
    }
    return room;
  }
}
