import cors from 'cors';
import path from 'path';
import YAML from 'yamljs';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './modules/auth/auth.routes';
import roomRoutes from './modules/room/room.routes';
import bookingRoutes from './modules/booking/booking.routes';
import { errorHandler } from './shared/middleware/errorMiddleware';
import { apiLimiter } from './shared/middleware/rateLimiter';

const app = express();

// Swagger documentation
const swaggerDocument = YAML.load(path.join(__dirname, './docs/swagger.yaml'));

app.use(cors());
app.use(express.json());

// Global Rate Limiting
app.use('/api/', apiLimiter);

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/rooms', roomRoutes);
app.use('/api/v1/bookings', bookingRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Global Error Handler
app.use(errorHandler);

export default app;
