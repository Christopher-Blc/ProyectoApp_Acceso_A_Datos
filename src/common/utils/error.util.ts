/**
 * Normaliza errores de ejecución a un contrato común `{ message, status }`.
 *
 * ¿Por qué existe?
 * - En muchos `catch` el error llega como `unknown`.
 * - Acceder directamente a `err.message` o `err.status` rompe reglas de tipado.
 *
 * Esta función centraliza el narrowing:
 * 1) Si es instancia de Error => usa su mensaje.
 * 2) Si es un objeto genérico => intenta leer message/status si existen.
 * 3) Si no se puede inferir nada => devuelve fallback seguro.
 */
export function normalizeError(err: unknown): {
  message: string;
  status: number;
} {
  // Caso típico de excepciones JS/TS (`throw new Error(...)`).
  if (err instanceof Error) {
    return { message: err.message, status: 500 };
  }

  // Caso de errores lanzados como objetos planos con `message` y `status`.
  if (typeof err === 'object' && err !== null) {
    const record = err as Record<string, unknown>;
    const message =
      typeof record.message === 'string' ? record.message : 'Unexpected error';
    const status = typeof record.status === 'number' ? record.status : 500;

    return { message, status };
  }

  // Último valor de respaldo para casos no previstos (string, number, null, etc.).
  return { message: 'Unexpected error', status: 500 };
}
