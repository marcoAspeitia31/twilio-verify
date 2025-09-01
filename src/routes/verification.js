import express from 'express';
import { sendCode, verifyCode } from '../controllers/verificationController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { captchaMiddleware } from '../middlewares/recaptchaMiddleware.js';
import { verifyJwt } from '../middlewares/jwtMiddleware.js';
import { hmacMiddleware } from '../middlewares/hmacMiddleware.js';

const router = express.Router();

router.post('/send-code', hmacMiddleware, verifyJwt, captchaMiddleware(process.env.ACTION_TWILIO_SEND), sendCode);
router.post('/verify-code', hmacMiddleware, verifyJwt, captchaMiddleware(process.env.ACTION_TWILIO_CONF), verifyCode);

export default router;
