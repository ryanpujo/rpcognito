import winston from 'winston';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (fs.existsSync('.env')) {
  config({ path: path.resolve(process.cwd(), '.env') });
} else {
  logger.info('there is no .env file available');
  logger.add(
    new winston.transports.Console({ format: winston.format.simple() })
  );
}

export const ENVIRONMENT = process.env.ENVIRONMENT;
export const isProd = ENVIRONMENT == 'prod';
export const MONGO_URI = isProd
  ? process.env.MONGO_URI
  : process.env.MONGO_URI_LOCAL;
export const JWT_KEY = process.env.JWT_KEY;
export const JWT_AUDIENCE = process.env.JWT_AUDIENCE;
export const JWT_ISSUER = process.env.JWT_ISSUER;
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!JWT_KEY || !JWT_AUDIENCE || !JWT_ISSUER || !ENCRYPTION_KEY) {
  logger.error('all mandatory env not provided');
  process.exit(1);
}

if (!MONGO_URI) {
  if (isProd) {
    logger.error('MONGO_URI is not set');
  } else {
    logger.error('MONGO_URI_LOCAL is not set');
  }
  process.exit(1);
}
