export const twilioErrorMessages = {
  // Twilio Verify API errors
  60200: 'El código de verificación no es válido',
  60201: 'El canal de verificación no está disponible',
  60202: 'El número de teléfono no es válido',
  60203: 'Has superado el número máximo de intentos permitidos',
  60210: 'No se puede enviar el código en este momento, intenta más tarde',

  // Common Twilio REST API errors
  20003: 'Autenticación inválida con Twilio',
  20404: 'El recurso solicitado no fue encontrado (puede ser un SID inválido)',
  20429: 'Demasiadas solicitudes, intenta de nuevo más tarde (rate limit)',
  21608: 'No tienes permisos para enviar mensajes a ese número',
  21610: 'El destinatario se dio de baja, no se pueden enviar mensajes',
  21614: 'El número de teléfono no es válido o no es móvil',
  30003: 'Mensaje fallido: el operador rechazó el envío',
  30006: 'Número suspendido o sin soporte para recibir mensajes SMS',
  30007: 'Mensaje bloqueado por filtrado (posible SPAM o política del operador)',

  // Otros
  unknown: 'Ocurrió un error inesperado con Twilio. Intenta de nuevo más tarde.'
};
