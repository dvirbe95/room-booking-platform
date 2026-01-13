import { AuthService } from '../auth.service';
import { AuthRepository } from '../auth.repository';
import { BadRequestError, UnauthorizedError } from '../../../shared/errors/AppError';
import { ErrorMessages } from '../../../shared/constants/enums';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../auth.repository');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService: AuthService;
  let authRepository: jest.Mocked<AuthRepository>;

  beforeEach(() => {
    authRepository = new AuthRepository() as jest.Mocked<AuthRepository>;
    authService = new AuthService();
    (authService as any).authRepository = authRepository;
  });

  describe('register', () => {
    it('should throw BadRequestError if user already exists', async () => {
      authRepository.findByEmail.mockResolvedValue({ id: '1', email: 'test@test.com' } as any);

      await expect(authService.register('test@test.com', 'password123'))
        .rejects.toThrow(new BadRequestError(ErrorMessages.USER_EXISTS));
    });

    it('should create user and return user with token', async () => {
      authRepository.findByEmail.mockResolvedValue(null);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      authRepository.createUser.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'USER',
      } as any);
      (jwt.sign as jest.Mock).mockReturnValue('fake-token');

      const result = await authService.register('test@test.com', 'password123', 'Test User');

      expect(authRepository.createUser).toHaveBeenCalledWith({
        email: 'test@test.com',
        password_hash: 'hashedPassword',
        name: 'Test User',
        role: 'USER',
      });
      expect(result).toHaveProperty('token', 'fake-token');
      expect(result.user.email).toBe('test@test.com');
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedError if user not found', async () => {
      authRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login('test@test.com', 'password123'))
        .rejects.toThrow(new UnauthorizedError(ErrorMessages.INVALID_CREDENTIALS));
    });

    it('should throw UnauthorizedError if password invalid', async () => {
      authRepository.findByEmail.mockResolvedValue({ email: 'test@test.com', password_hash: 'hashed' } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login('test@test.com', 'password123'))
        .rejects.toThrow(new UnauthorizedError(ErrorMessages.INVALID_CREDENTIALS));
    });

    it('should return user and token if credentials valid', async () => {
      const user = { id: '1', email: 'test@test.com', password_hash: 'hashed', role: 'USER' };
      authRepository.findByEmail.mockResolvedValue(user as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('fake-token');

      const result = await authService.login('test@test.com', 'password123');

      expect(result.token).toBe('fake-token');
      expect(result.user.id).toBe('1');
    });
  });
});
