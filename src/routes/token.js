import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { generateToken } from '../controllers/tokenController.js';

const router = express.Router();

router.get('/get-public-token', authMiddleware, generateToken);

export default router;