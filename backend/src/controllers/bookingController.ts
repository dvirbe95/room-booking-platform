import { Response } from 'express';
import { getClient, query } from '../db';
import { AuthRequest } from '../middleware/authMiddleware';

export const createBooking = async (req: AuthRequest, res: Response) => {
  const { roomId, checkIn, checkOut } = req.body;
  const userId = req.user?.id;

  if (!roomId || !checkIn || !checkOut) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const client = await getClient();

  try {
    await client.query('BEGIN');

    // 1. Calculate the number of days in the stay
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const dayCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    if (dayCount <= 0) {
      throw new Error('Check-out must be after check-in');
    }

    // 2. Lock the availability rows for the room and date range to prevent race conditions
    // Using FOR UPDATE on the select query ensures other transactions must wait.
    const availabilityCheck = await client.query(
      `SELECT * FROM room_availability 
       WHERE room_id = $1 AND date >= $2 AND date < $3 
       FOR UPDATE`,
      [roomId, checkIn, checkOut]
    );

    // 3. Verify availability for EVERY day in the range
    if (availabilityCheck.rowCount !== dayCount) {
      throw new Error('Availability data missing for some dates in the range');
    }

    const isAvailable = availabilityCheck.rows.every(row => row.available_count > 0);
    if (!isAvailable) {
      throw new Error('Room is no longer available for the selected dates');
    }

    // 4. Update availability (decrement count)
    await client.query(
      `UPDATE room_availability 
       SET available_count = available_count - 1 
       WHERE room_id = $1 AND date >= $2 AND date < $3`,
      [roomId, checkIn, checkOut]
    );

    // 5. Create booking record
    const bookingResult = await client.query(
      `INSERT INTO bookings (user_id, room_id, check_in, check_out) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [userId, roomId, checkIn, checkOut]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Booking confirmed',
      booking: bookingResult.rows[0]
    });

  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error('Booking error:', err);
    res.status(400).json({ error: err.message || 'Failed to create booking' });
  } finally {
    client.release();
  }
};

export const getUserBookings = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  try {
    const result = await query(
      `SELECT b.*, r.name as room_name, r.location, r.price_per_night 
       FROM bookings b 
       JOIN rooms r ON b.room_id = r.id 
       WHERE b.user_id = $1 
       ORDER BY b.created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get user bookings error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
