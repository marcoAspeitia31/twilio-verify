import express from 'express';
import { corsMiddleware, handleCorsError } from './middlewares/corsMiddleware.js';
import { authMiddleware } from './middlewares/authMiddleware.js';
import verificationRoutes from './routes/verification.js';

const app = express();

app.use(express.json());
app.use(corsMiddleware);
app.use(authMiddleware);
app.use('/api/verify', verificationRoutes);
app.use(handleCorsError); // Manejo de error de CORS

export default app;
