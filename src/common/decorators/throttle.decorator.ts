import {
  SkipThrottle as NestSkipThrottle,
  Throttle as NestThrottle,
} from '@nestjs/throttler';

/**
 * @Throttle(name)
 *
 * Decorator to change the rate limiting profile of an endpoint
 *
 * Available profiles:
 * - 'default': 100 requests / 15 minutes (general endpoints)
 * - 'auth': 10 requests / 1 hour (authentication endpoints)
 *
 * @param name - Name of the throttle profile to use
 *
 * @example
 * ```typescript
 * @Post('login')
 * @Throttle('auth')  // More restrictive
 * async login() { ... }
 * ```
 *
 * Without this decorator, uses 'default'
 *
 * How it works:
 * 1. SetMetadata stores metadata on the endpoint
 * 2. ThrottlerGuard reads this metadata at runtime
 * 3. Applies the limits of the specified profile
 */
export const Throttle = (name: 'default' | 'auth' | 'Auth') => {
  const profile = name === 'Auth' ? 'auth' : name;
  return NestThrottle({ [profile]: {} });
};

/**
 * @SkipThrottle()
 *
 * Decorator to completely skip rate limiting on an endpoint
 *
 * Use it ONLY when necessary (e.g.: /health, public webhooks)
 *
 * @example
 * ```typescript
 * @Get('health')
 * @SkipThrottle()  // No limit
 * async getHealth() { ... }
 * ```
 *
 * How it works:
 * 1. SetMetadata marks the endpoint as skipThrottle
 * 2. ThrottlerGuard checks this metadata
 * 3. If present, THE GUARD DOES NOT APPLY LIMIT
 *
 * ⚠️ Warning: use it only for endpoints that should be accessible
 */
export const SkipThrottle = () =>
  NestSkipThrottle({ default: true, auth: true });
