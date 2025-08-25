import twilio from 'twilio';
import { sanitizeMexicanPhoneNumber } from '../utils/formatPhone.js';
import { twilioErrorMessages } from '../utils/twilioErrorMap.js';
import logger from '../utils/logger.js';

let client;
let serviceSid;

function ensureTwilioClient() {
  const {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_API_KEY,
    TWILIO_API_SECRET,
    TWILIO_VERIFY_SERVICE_SID,
  } = process.env;

  if (!TWILIO_VERIFY_SERVICE_SID) {
    throw new Error('[Config] Falta TWILIO_VERIFY_SERVICE_SID');
  }

  if (!client) {
    // Opción A: SID + Auth Token
    if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
      client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    }
    // Opción B: API Keys
    else if (TWILIO_API_KEY && TWILIO_API_SECRET && TWILIO_ACCOUNT_SID) {
      client = new twilio(TWILIO_API_KEY, TWILIO_API_SECRET, {
        accountSid: TWILIO_ACCOUNT_SID,
      });
    }
    else {
      throw new Error('[Config] Faltan credenciales Twilio (SID/Auth o API Key/Secret)');
    }
  }

  serviceSid = TWILIO_VERIFY_SERVICE_SID;
  return { client, serviceSid };
}

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

    const { client, serviceSid } = ensureTwilioClient();

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

    const { client, serviceSid } = ensureTwilioClient();
    
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
