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

    if (level === LogLevel.ERROR) {
      console.error(logString);
    } else {
      console.log(logString);
    }

    try {
      if (redisClient.isOpen) {
        await redisClient.lPush(this.LOG_KEY, logString);
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
}
