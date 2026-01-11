import { Role } from '@prisma/client';
import prisma from '../../shared/utils/prisma';

export class AuthRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(data: { email: string; password_hash: string; name?: string; role?: Role }) {
    return prisma.user.create({
      data,
    });
  }
}
