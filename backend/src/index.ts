import dotenv from 'dotenv';
import app from './app';
import { Logger } from './shared/utils/logger';
import { connectRedis } from './shared/utils/redis';

dotenv.config();

const port = process.env.PORT || 5000;

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
