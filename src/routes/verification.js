import express from 'express';
import { sendCode, verifyCode } from '../controllers/verificationController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/send-code', authMiddleware, sendCode);
router.post('/verify-code', authMiddleware, verifyCode);

export default router;
