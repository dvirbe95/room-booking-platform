import { redisClient } from './redis';

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export class Logger {
  private static LOG_KEY = 'app_logs';

  static async log(level: LogLevel, message: string, context?: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };

    const logString = JSON.stringify(logEntry);

    // 1. Log to console for immediate visibility
    if (level === LogLevel.ERROR) {
      console.error(logString);
    } else {
      console.log(logString);
    }

    // 2. Push to Redis List for persistent/asynchronous processing
    try {
      if (redisClient.isOpen) {
        await redisClient.lPush(this.LOG_KEY, logString);
        // Trim the list to keep only the last 1000 logs (prevents Redis from bloating)
        await redisClient.lTrim(this.LOG_KEY, 0, 999);
      }
    } catch (err) {
      console.error('Failed to write log to Redis:', err);
    }
  }

  static info(message: string, context?: any) {
    return this.log(LogLevel.INFO, message, context);
  }

  static warn(message: string, context?: any) {
    return this.log(LogLevel.WARN, message, context);
  }

  static error(message: string, context?: any) {
    return this.log(LogLevel.ERROR, message, context);
  }

  static async getRecentLogs(limit: number = 100) {
    try {
      if (redisClient.isOpen) {
        const logs = await redisClient.lRange(this.LOG_KEY, 0, limit - 1);
        return logs.map((log) => JSON.parse(log));
      }
      return [];
    } catch (err) {
      console.error('Failed to fetch logs from Redis:', err);
      return [];
    }
  }
}
