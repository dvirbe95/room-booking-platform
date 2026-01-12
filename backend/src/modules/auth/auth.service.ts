import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { AuthRepository } from './auth.repository';
import { BadRequestError, UnauthorizedError } from '../../shared/errors/AppError';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-123';

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async register(email: string, password: string, name?: string) {
    const existingUser = await this.authRepository.findByEmail(email);
    if (existingUser) {
      throw new BadRequestError('User with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await this.authRepository.createUser({
      email,
      password_hash: passwordHash,
      name,
      role: Role.USER,
    });

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }

  async login(email: string, password: string) {
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }

  private generateToken(id: string, email: string, role: Role): string {
    return jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: '24h' });
  }
}
