import { Request, Response } from 'express';
import { query } from '../db';

export const searchRooms = async (req: Request, res: Response) => {
  const { location, checkIn, checkOut } = req.query;

  if (!checkIn || !checkOut) {
    return res.status(400).json({ error: 'checkIn and checkOut dates are required' });
  }

  try {
    // We want to find rooms that have at least one unit available for EVERY day in the range
    const sql = `
      SELECT r.*, MIN(ra.available_count) as available_units
      FROM rooms r
      JOIN room_availability ra ON r.id = ra.room_id
      WHERE ra.date >= $1 AND ra.date < $2
      ${location ? 'AND r.location ILIKE $3' : ''}
      GROUP BY r.id
      HAVING MIN(ra.available_count) > 0
    `;

    const params = location 
      ? [checkIn, checkOut, `%${location}%`] 
      : [checkIn, checkOut];

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getRoomById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await query('SELECT * FROM rooms WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get room error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
