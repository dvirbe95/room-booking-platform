export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: Role;
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  price_per_night: number;
  location: string;
  total_inventory: number;
  available_units?: number;
}

export interface Booking {
  id: string;
  user_id: string;
  room_id: string;
  check_in: string;
  check_out: string;
  status: BookingStatus;
  created_at: string;
  room?: Partial<Room>;
}
