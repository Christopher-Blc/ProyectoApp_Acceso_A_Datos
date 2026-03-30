/**
 * VALIDATION PATTERNS Y CONSTANTS
 *
 * Punto central de patrones regex y longitudes usadas en DTOs.
 * Reutilizable en todo el backend para evitar duplicados.
 */

export const VALIDATION_PATTERNS = {
  email: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: 'Formato de email invalido',
    example: 'usuario@correo.com',
    description: 'Email valido',
  },

  password: {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,128}$/,
    message:
      'La contrasena debe tener entre 8 y 128 caracteres, incluir mayuscula, minuscula, numero y simbolo.',
    example: 'Abc@1234',
    description: 'Contrasena segura',
  },

  phone: {
    pattern: /^\d{9}$/,
    message: 'El telefono debe tener exactamente 9 digitos',
    example: '612345678',
    description: 'Telefono nacional',
  },

  dni: {
    pattern: /^[0-9]{8}[A-Z]{1}$/,
    message: 'Formato de DNI invalido. Ejemplo: 12345678A',
    example: '12345678A',
    description: 'DNI espanol',
  },
};

export const VALIDATION_LENGTHS = {
  email: { min: 5, max: 100 },
  password: { min: 8, max: 128 },
  name: { min: 2, max: 60 },
  surname: { min: 2, max: 80 },
  address: { min: 5, max: 140 },
  message: { min: 2, max: 500 },
  title: { min: 2, max: 120 },
  phone: { min: 9, max: 9 },
  dni: { min: 9, max: 9 },
};

export const VALIDATION_LIMITS = {
  rating: { min: 1, max: 5 },
  porcentaje: { min: 0, max: 100 },
  precio: { min: 0 },
};

