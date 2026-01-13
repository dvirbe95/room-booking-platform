import request from 'supertest';
import app from './app';
import { ApiRoutes, HttpStatus } from './shared/constants/enums';

// We mock the DB to avoid needing a real DB for integration smoke tests
jest.mock('./shared/utils/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock Redis
jest.mock('./shared/utils/redis', () => ({
  redisClient: {
    isOpen: false,
    on: jest.fn(),
    connect: jest.fn(),
  },
  connectRedis: jest.fn(),
}));

describe('Integration Tests', () => {
  describe('Health Check', () => {
    it('should return 200 OK', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('Auth API Smoke Test', () => {
    it('should return 400 for invalid registration data', async () => {
      const response = await request(app)
        .post(`${ApiRoutes.AUTH}/register`)
        .send({ email: 'invalid-email' });
      
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });
});
