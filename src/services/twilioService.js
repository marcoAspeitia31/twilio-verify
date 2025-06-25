import twilio from 'twilio';
import { sanitizeMexicanPhoneNumber } from '../utils/formatPhone.js';
import { twilioErrorMessages } from '../utils/twilioErrorMap.js';
import logger from '../utils/logger.js';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

export async function sendCode(phoneNumber) {
  const sanitizedPhone = sanitizeMexicanPhoneNumber(phoneNumber);

  if (!phoneNumber) {
    return {
      status: 400,
      payload: { success: false, message: 'El número de teléfono es requerido' }
    };
  }

  if (!sanitizedPhone) {
    return {
      status: 400,
      payload: { success: false, message: 'Número inválido. Usa formato mexicano de 10 dígitos o +52' }
    };
  }

  try {
    await client.verify.v2.services(serviceSid)
      .verifications
      .create({ to: sanitizedPhone, channel: 'sms' });

    logger.info(`Código enviado a ${sanitizedPhone}`);

    return {
      status: 200,
      payload: {
        success: true,
        status: 'code_sent',
        message: 'Código de verificación enviado exitosamente'
      }
    };
  } catch (err) {
    const statusCode = err.status || 500;
    const errorCode = err.code || 'unknown';
    const translatedMessage = twilioErrorMessages[errorCode] || twilioErrorMessages['unknown'];

    logger.error(`Error al enviar código a ${sanitizedPhone} - ${translatedMessage}`);

    return {
      status: statusCode,
      payload: {
        success: false,
        status: 'twilio_error',
        errorCode,
        message: translatedMessage
      }
    };
  }
}

export async function verifyCode(phoneNumber, code) {
  const sanitizedPhone = sanitizeMexicanPhoneNumber(phoneNumber);

  if (!phoneNumber || !code) {
    return {
      status: 400,
      payload: {
        success: false,
        status: 'invalid_input',
        message: 'Número de teléfono y código son requeridos'
      }
    };
  }

  if (!sanitizedPhone) {
    return {
      status: 400,
      payload: {
        success: false,
        message: 'Número inválido. Usa formato mexicano de 10 dígitos o +52'
      }
    };
  }

  try {
    const result = await client.verify.v2.services(serviceSid)
      .verificationChecks
      .create({ to: sanitizedPhone, code });

    logger.info(`Verificación para ${sanitizedPhone} - Status: ${result.status}`);

    if (result.status === 'approved') {
      return {
        status: 200,
        payload: {
          success: true,
          status: 'code_verified',
          message: 'Verificación exitosa'
        }
      };
    } else {
      return {
        status: 401,
        payload: {
          success: false,
          status: 'verification_failed',
          message: 'El código es inválido o ha expirado',
          twilioStatus: result.status
        }
      };
    }
  } catch (err) {
    const statusCode = err.status || 500;
    const errorCode = err.code || 'unknown';
    const translatedMessage = twilioErrorMessages[errorCode] || twilioErrorMessages['unknown'];

    logger.error(`Error al verificar código de ${sanitizedPhone} - ${translatedMessage}`);

    return {
      status: statusCode,
      payload: {
        success: false,
        status: 'twilio_error',
        errorCode,
        message: translatedMessage
      }
    };
  }
}
