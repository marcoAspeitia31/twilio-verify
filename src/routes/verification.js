import express from 'express';
import { sendCode, verifyCode } from '../services/twilioService.js';

const router = express.Router();

router.post('/send-code', sendCode);
router.post('/verify-code', verifyCode);

export default router;
