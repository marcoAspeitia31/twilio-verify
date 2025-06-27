import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';

// Ruta donde se guardarán los logs
const logDir = path.resolve('logs');

// Crea la carpeta logs si no existe
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Transporte con rotación de archivos diarios y tamaño máximo
const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logDir, 'app-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxSize: '5m',          // rota si pasa de 5 MB
  maxFiles: '7d'          // conserva solo 7 días
});

// Configuración del logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(
      ({ level, message, timestamp }) => `[${level.toUpperCase()}] ${timestamp} - ${message}`
    )
  ),
  transports: [
    new winston.transports.Console(),    // imprime en consola (para docker logs)
    fileRotateTransport                  // guarda en archivo rotado
  ]
});

export default logger;
