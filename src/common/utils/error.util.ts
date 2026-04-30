/**
 * Normalizes runtime errors to a common contract `{ message, status }`.
 *
 * Why does it exist?
 * - In many `catch` blocks the error arrives as `unknown`.
 * - Directly accessing `err.message` or `err.status` breaks type safety lint rules.
 *
 * This function centralizes the narrowing:
 * 1) If it's an instance of Error => use its message.
 * 2) If it's a generic object => try to read message/status if they exist.
 * 3) If nothing can be inferred => return safe fallback.
 */
export function normalizeError(err: unknown): {
  message: string;
  status: number;
} {
  // Typical case of JS/TS exceptions (`throw new Error(...)`).
  if (err instanceof Error) {
    return { message: err.message, status: 500 };
  }

  // Case of errors thrown as plain objects with `message` and `status`.
  if (typeof err === 'object' && err !== null) {
    const record = err as Record<string, unknown>;
    const message =
      typeof record.message === 'string' ? record.message : 'Unexpected error';
    const status = typeof record.status === 'number' ? record.status : 500;

    return { message, status };
  }

  // Last fallback for unforeseen cases (string, number, null, etc.).
  return { message: 'Unexpected error', status: 500 };
}
