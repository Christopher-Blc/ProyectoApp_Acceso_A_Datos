/**
 * Normaliza errores de runtime a un contrato común `{ message, status }`.
 *
 * ¿Por qué existe?
 * - En muchos `catch` el error llega como `unknown`.
 * - Acceder directamente a `err.message` o `err.status` rompe reglas de lint
 *   de seguridad de tipos.
 *
 * Esta función centraliza el narrowing:
 * 1) Si es instancia de Error => usa su message.
 * 2) Si es objeto genérico => intenta leer message/status si existen.
 * 3) Si no se puede inferir nada => devuelve fallback seguro.
 */
export function normalizeError(err: unknown): {
  message: string;
  status: number;
} {
  // Caso típico de excepciones de JS/TS (`throw new Error(...)`).
  if (err instanceof Error) {
    return { message: err.message, status: 500 };
  }

  // Caso de errores lanzados como objeto plano con `message` y `status`.
  if (typeof err === 'object' && err !== null) {
    const record = err as Record<string, unknown>;
    const message =
      typeof record.message === 'string' ? record.message : 'Unexpected error';
    const status = typeof record.status === 'number' ? record.status : 500;

    return { message, status };
  }

  // Último fallback para casos no contemplados (string, number, null, etc.).
  return { message: 'Unexpected error', status: 500 };
}
