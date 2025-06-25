import twilio from 'twilio';
import { sanitizeMexicanPhoneNumber } from '../utils/formatPhone.js';
import { twilioErrorMessages } from '../utils/twilioErrorMap.js';
import logger from '../utils/logger.js';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

export async function sendCode(req, res) {
  const { phoneNumber } = req.body;
  const sanitizedPhoneNumber = sanitizeMexicanPhoneNumber(phoneNumber);

  if (!phoneNumber) {
    return res.status(400).json({ error: 'El numero de teléfono es requerido' });
  }

  if (!sanitizedPhoneNumber) {
    return res.status(400).json({ error: 'Número inválido. Usa formato mexicano de 10 dígitos o +52' });
  }

  try {
    await client.verify.v2.services(serviceSid)
      .verifications
      .create({ to: sanitizedPhoneNumber, channel: 'sms' });

    logger.info(`Código enviado a ${sanitizedPhoneNumber}`);

    res.status(200).json({
      success: true,
      status: 'code_sent',
      message: 'Código de verificación enviado exitosamente'
    });
  } catch (err) {
    const statusCode = err.status || 500;
    const errorCode = err.code || 'unknown';
    const translatedMessage = twilioErrorMessages[errorCode] || twilioErrorMessages['unknown'];

    logger.error(`Error al enviar código a ${sanitizedPhoneNumber} - ${translatedMessage}`);


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
  const sanitizedPhoneNumber = sanitizeMexicanPhoneNumber(phoneNumber);

  if (!phoneNumber || !code) {
    return res.status(400).json({
      success: false,
      status: 'invalid_input',
      message: 'Número de teléfono y código son requeridos'
    });
  }

  if (!sanitizedPhoneNumber) {
    return res.status(400).json({
      error: 'Número inválido. Asegúrate de usar un número mexicano de 10 dígitos o en formato +52XXXXXXXXXX',
    });
  }

  try {
    const result = await client.verify.v2.services(serviceSid)
      .verificationChecks
      .create({ to: sanitizedPhoneNumber, code });

    logger.info(`Código enviado a ${sanitizedPhoneNumber}`);

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

    logger.error(`Error al enviar código a ${sanitizedPhoneNumber} - ${translatedMessage}`);


    return res.status(statusCode).json({
      success: false,
      status: 'twilio_error',
      errorCode,
      message: translatedMessage
    });
  }
}

