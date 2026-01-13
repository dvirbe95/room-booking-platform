import { RoomService } from '../room.service';
import { RoomRepository } from '../room.repository';
import { NotFoundError } from '../../../shared/errors/AppError';

jest.mock('../room.repository');

describe('RoomService', () => {
  let roomService: RoomService;
  let roomRepository: jest.Mocked<RoomRepository>;

  beforeEach(() => {
    roomRepository = new RoomRepository() as jest.Mocked<RoomRepository>;
    roomService = new RoomService();
    (roomService as any).roomRepository = roomRepository;
  });

  describe('searchAvailableRooms', () => {
    it('should return available rooms from repository', async () => {
      const mockRooms = [
        { 
          id: '1', 
          name: 'Deluxe Room', 
          availability: [{ available_count: 5 }, { available_count: 3 }] 
        }
      ];
      roomRepository.findAllAvailable.mockResolvedValue(mockRooms as any);

      const result = await roomService.searchAvailableRooms('2026-01-20', '2026-01-22', 'Tel Aviv');

      expect(roomRepository.findAllAvailable).toHaveBeenCalledWith(
        expect.any(Date),
        expect.any(Date),
        'Tel Aviv'
      );
      expect(result[0]).toHaveProperty('available_units', 3);
    });
  });

  describe('getRoomDetails', () => {
    it('should throw NotFoundError if room does not exist', async () => {
      roomRepository.findById.mockResolvedValue(null);

      await expect(roomService.getRoomDetails('invalid-id'))
        .rejects.toThrow(NotFoundError);
    });

    it('should return room if found', async () => {
      const mockRoom = { id: '1', name: 'Deluxe Room' };
      roomRepository.findById.mockResolvedValue(mockRoom as any);

      const result = await roomService.getRoomDetails('1');

      expect(result).toEqual(mockRoom);
    });
  });
});
