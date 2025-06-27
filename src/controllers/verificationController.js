import * as twilioService from '../services/twilioService.js';

export async function sendCode(req, res) {
    const { phoneNumber } = req.body;
    const result = await twilioService.sendCode(phoneNumber);
    return res.status(result.status).json(result.payload);
}

export async function verifyCode(req, res) {
    const { phoneNumber, code } = req.body;
    const result = await twilioService.verifyCode(phoneNumber, code);
    return res.status(result.status).json(result.payload);
}
