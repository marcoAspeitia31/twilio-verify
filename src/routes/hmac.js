import express from 'express';
import { generateHmacSign } from '../controllers/hmacController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/generate-sign', authMiddleware, generateHmacSign);

export default router;