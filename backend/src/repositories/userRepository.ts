import { query } from '../db';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  name?: string;
  created_at?: Date;
}

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rowCount ? result.rows[0] : null;
  }

  async findById(id: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rowCount ? result.rows[0] : null;
  }

  async create(email: string, passwordHash: string, name?: string): Promise<User> {
    const result = await query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
      [email, passwordHash, name]
    );
    return result.rows[0];
  }
}
