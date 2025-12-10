import fs from 'fs';
import path from 'path';
import winston from 'winston';
import 'winston-daily-rotate-file';

const now = new Date();
const year = now.getFullYear();
const month = now.toLocaleString('default', { month: 'long' });
const logDir = path.join('logs', `${year}`, `${month}`);

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

export const httpLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YY-MM-DD HH:mm:ss' }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: path.join(logDir, '%DATE%-http.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '1830d', // keep ~5 years
      zippedArchive: true,
    }),
    new winston.transports.Console(),
  ],
});
export default httpLogger;
