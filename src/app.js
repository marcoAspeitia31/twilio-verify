import express from 'express';
import { corsMiddleware, handleCorsError } from './middlewares/corsMiddleware.js';
import verificationRoutes from './routes/verification.js';
import tokenRoutes from './routes/token.js';
import hmacRoutes from './routes/hmac.js';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

app.use(express.json());
app.use(corsMiddleware);
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
}));
app.use(morgan("combined"));
app.use('/api/hmac', hmacRoutes);
app.use('/api/token', tokenRoutes);
app.use('/api/verify', verificationRoutes);
app.use(handleCorsError); // Manejo de error de CORS

export default app;
