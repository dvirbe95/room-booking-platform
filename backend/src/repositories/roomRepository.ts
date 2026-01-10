import { query } from '../db';

export interface Room {
  id: string;
  name: string;
  description?: string;
  price_per_night: number;
  location: string;
  total_inventory: number;
}

export interface RoomWithAvailability extends Room {
  available_units: number;
}

export class RoomRepository {
  async findAllAvailable(checkIn: string, checkOut: string, location?: string): Promise<RoomWithAvailability[]> {
    const sql = `
      SELECT r.*, MIN(ra.available_count) as available_units
      FROM rooms r
      JOIN room_availability ra ON r.id = ra.room_id
      WHERE ra.date >= $1 AND ra.date < $2
      ${location ? 'AND r.location ILIKE $3' : ''}
      GROUP BY r.id, r.name, r.description, r.price_per_night, r.location, r.total_inventory
      HAVING MIN(ra.available_count) > 0
    `;

    const params = location 
      ? [checkIn, checkOut, `%${location}%`] 
      : [checkIn, checkOut];

    const result = await query(sql, params);
    return result.rows;
  }

  async findById(id: string): Promise<Room | null> {
    const result = await query('SELECT * FROM rooms WHERE id = $1', [id]);
    return result.rowCount ? result.rows[0] : null;
  }
}
