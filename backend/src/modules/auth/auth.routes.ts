import { Router } from 'express';
import * as authController from './auth.controller';
import { validate } from '../../shared/middleware/validationMiddleware';
import { registerSchema, loginSchema } from '../../shared/utils/schemas';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

export default router;
