import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

import authRoutes from './modules/auth/auth.routes';
import roomRoutes from './modules/room/room.routes';
import bookingRoutes from './modules/booking/booking.routes';
import { errorHandler } from './shared/middleware/errorMiddleware';
import { connectRedis } from './shared/utils/redis';
import { Logger } from './shared/utils/logger';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Swagger documentation
const swaggerDocument = YAML.load(path.join(__dirname, './docs/swagger.yaml'));

app.use(cors());
app.use(express.json());

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

const startServer = async () => {
  try {
    // Redis Setup
    await connectRedis();

    app.listen(port, () => {
      Logger.info(`Server is running on port ${port}`);
    });
  } catch (err) {
    Logger.error('Failed to start server', { error: err });
    process.exit(1);
  }
};

startServer();
