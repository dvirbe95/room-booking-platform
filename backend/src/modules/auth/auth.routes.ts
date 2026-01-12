import { Router } from 'express';
import * as authController from './auth.controller';
import { validate } from '../../shared/middleware/validationMiddleware';
import { registerSchema, loginSchema } from '../../shared/utils/schemas';
import { authLimiter } from '../../shared/middleware/rateLimiter';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);

export default router;
