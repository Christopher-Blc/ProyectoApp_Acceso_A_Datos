import {
  SkipThrottle as NestSkipThrottle,
  Throttle as NestThrottle,
} from '@nestjs/throttler';

/**
 * @Throttle(name)
 *
 * Decorador para cambiar el perfil de rate limiting de un endpoint
 *
 * Perfiles disponibles:
 * - 'default': 100 requests / 15 minutos (endpoints generales)
 * - 'auth': 10 requests / 1 hora (endpoints de autenticación)
 *
 * @param name - Nombre del perfil de throttle a usar
 *
 * @example
 * ```typescript
 * @Post('login')
 * @Throttle('auth')  // Más restrictivo
 * async login() { ... }
 * ```
 *
 * Sin este decorador, usa 'default'
 *
 * Cómo funciona:
 * 1. SetMetadata guarda metadata en el endpoint
 * 2. ThrottlerGuard lee esta metadata en tiempo de ejecución
 * 3. Aplica los límites del perfil especificado
 */
export const Throttle = (name: 'default' | 'auth' | 'Auth') => {
  const profile = name === 'Auth' ? 'auth' : name;
  return NestThrottle({ [profile]: {} });
};

/**
 * @SkipThrottle()
 *
 * Decorador para saltar rate limiting completamente en un endpoint
 *
 * Úsalo SOLO cuando sea necesario (ej: /health, webhooks públicos)
 *
 * @example
 * ```typescript
 * @Get('health')
 * @SkipThrottle()  // Sin límite
 * async getHealth() { ... }
 * ```
 *
 * Cómo funciona:
 * 1. SetMetadata marca el endpoint como skipThrottle
 * 2. ThrottlerGuard verifica esta metadata
 * 3. Si está presente, THE GUARD NO APLICA LÍMITE
 *
 * ⚠️ Cuidado: úsalo solo para endpoints que deban ser accesibles
 */
export const SkipThrottle = () =>
  NestSkipThrottle({ default: true, auth: true });
