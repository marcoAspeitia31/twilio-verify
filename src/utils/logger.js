import fs from 'fs';
import path from 'path';

const logFile = path.resolve('logs/app.log');

export function logInfo(message) {
  const entry = `[INFO] ${new Date().toISOString()} - ${message}\n`;
  fs.appendFileSync(logFile, entry);
}

export function logError(message) {
  const entry = `[ERROR] ${new Date().toISOString()} - ${message}\n`;
  fs.appendFileSync(logFile, entry);
}
