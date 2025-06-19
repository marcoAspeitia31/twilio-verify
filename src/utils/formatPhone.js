export function sanitizeMexicanPhoneNumber(phoneNumber) {
  if (!phoneNumber) return null;

  // Eliminar todo lo que no sea número
  const digitsOnly = phoneNumber.replace(/\D/g, '');

  // Validar si ya viene con código país +52
  if (digitsOnly.startsWith('52') && digitsOnly.length === 12) {
    return `+${digitsOnly}`;
  }

  // Si es un número local de 10 dígitos, agregarle el +52
  if (digitsOnly.length === 10) {
    return `+52${digitsOnly}`;
  }

  // Número inválido
  return null;
}
