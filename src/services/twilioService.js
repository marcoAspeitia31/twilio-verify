import twilio from 'twilio';
import { twilioErrorMessages } from '../utils/twilioErrorMap.js';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

export async function sendCode(req, res) {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    await client.verify.v2.services(serviceSid)
      .verifications
      .create({ to: phoneNumber, channel: 'sms' });

    res.status(200).json({
      success: true,
      status: 'code_sent',
      message: 'Código de verificación enviado exitosamente'
    });
  } catch (err) {
    const statusCode = err.status || 500;
    const errorCode = err.code || 'unknown';
    const translatedMessage = twilioErrorMessages[errorCode] || twilioErrorMessages['unknown'];

    return res.status(statusCode).json({
      success: false,
      status: 'twilio_error',
      errorCode,
      message: translatedMessage
    });
  }
}


export async function verifyCode(req, res) {
  const { phoneNumber, code } = req.body;

  if (!phoneNumber || !code) {
    return res.status(400).json({
      success: false,
      status: 'invalid_input',
      message: 'Número de teléfono y código son requeridos'
    });
  }

  try {
    const result = await client.verify.v2.services(serviceSid)
      .verificationChecks
      .create({ to: phoneNumber, code });

    if (result.status === 'approved') {
      return res.status(200).json({
        success: true,
        status: 'code_verified',
        message: 'Verificación exitosa'
      });
    } else {
      return res.status(401).json({
        success: false,
        status: 'verification_failed',
        message: 'El código es inválido o ha expirado',
        twilioStatus: result.status
      });
    }
  } catch (err) {
    const statusCode = err.status || 500;
    const errorCode = err.code || 'unknown';
    const translatedMessage = twilioErrorMessages[errorCode] || twilioErrorMessages['unknown'];

    return res.status(statusCode).json({
      success: false,
      status: 'twilio_error',
      errorCode,
      message: translatedMessage
    });
  }
}

