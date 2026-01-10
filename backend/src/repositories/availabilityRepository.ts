import { PoolClient } from 'pg';

export interface RoomAvailability {
  room_id: string;
  date: Date;
  available_count: number;
}

export class AvailabilityRepository {
  async getAndLockRange(
    client: PoolClient,
    roomId: string,
    checkIn: string,
    checkOut: string
  ): Promise<RoomAvailability[]> {
    const result = await client.query(
      `SELECT * FROM room_availability 
       WHERE room_id = $1 AND date >= $2 AND date < $3 
       FOR UPDATE`,
      [roomId, checkIn, checkOut]
    );
    return result.rows;
  }

  async decrementRange(
    client: PoolClient,
    roomId: string,
    checkIn: string,
    checkOut: string
  ): Promise<void> {
    await client.query(
      `UPDATE room_availability 
       SET available_count = available_count - 1 
       WHERE room_id = $1 AND date >= $2 AND date < $3`,
      [roomId, checkIn, checkOut]
    );
  }
}
