/**
 * VALIDATION PATTERNS AND CONSTANTS
 *
 * Central point for regex patterns and lengths used in DTOs.
 * Reusable throughout the backend to avoid duplicates.
 */

export const VALIDATION_PATTERNS = {
  email: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: 'Invalid email format',
    example: 'user@email.com',
    description: 'Valid email',
  },

  password: {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,128}$/,
    message:
      'Password must be 8-128 characters including uppercase, lowercase, number and symbol.',
    example: 'Abc@1234',
    description: 'Secure password',
  },

  phone: {
    pattern: /^\d{9}$/,
    message: 'Phone must be exactly 9 digits',
    example: '612345678',
    description: 'National phone',
  },

  dni: {
    pattern: /^[0-9]{8}[A-Z]{1}$/,
    message: 'Invalid DNI format. Example: 12345678A',
    example: '12345678A',
    description: 'Spanish DNI',
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
