import { PoolClient } from 'pg';
import { query } from '../db';

export interface Booking {
  id: string;
  user_id: string;
  room_id: string;
  check_in: Date;
  check_out: Date;
  status: string;
  created_at: Date;
}

export class BookingRepository {
  async create(
    client: PoolClient,
    userId: string,
    roomId: string,
    checkIn: string,
    checkOut: string
  ): Promise<Booking> {
    const result = await client.query(
      `INSERT INTO bookings (user_id, room_id, check_in, check_out) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [userId, roomId, checkIn, checkOut]
    );
    return result.rows[0];
  }

  async findByUserId(userId: string): Promise<any[]> {
    const result = await query(
      `SELECT b.*, r.name as room_name, r.location, r.price_per_night 
       FROM bookings b 
       JOIN rooms r ON b.room_id = r.id 
       WHERE b.user_id = $1 
       ORDER BY b.created_at DESC`,
      [userId]
    );
    return result.rows;
  }
}
