import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const searchRoomsSchema = z.object({
  query: z.object({
    location: z.string().optional(),
    checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  }),
});

export const createBookingSchema = z.object({
  body: z.object({
    roomId: z.string().uuid(),
    checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  }),
});

export const createRoomSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    price_per_night: z.number().positive(),
    location: z.string().min(2),
    total_inventory: z.number().int().positive(),
  }),
});
