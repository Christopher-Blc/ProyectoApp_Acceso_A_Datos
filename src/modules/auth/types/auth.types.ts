import type { Request } from 'express';

/**
 * Tipo para el payload del JWT.
 *
 * NOTA IMPORTANTE sobre @nestjs/jwt.signAsync():
 * La librería @nestjs/jwt tiene un problema de tipado donde sus overloads de
 * signAsync no capturan correctamente objetos Record<string, string | number>.
 * Aunque los tipos son correctos en tiempo de ejecución, TypeScript rechaza
 * la asignación. Por lo tanto, en AuthService usamos `as any` de forma localizada
 * en las llamadas a signAsync.
 *
 * Este tipo se mantiene como referencia conceptual, pero la implementación
 * real usa Record<string, string | number> con cast a any.
 *
 * La alternativa sería monkeypatching o mantener versión antigua de @nestjs/jwt,
 * pero ambas opciones son más invasivas que un cast localizado bien documentado.
 */
export type JwtPayload = Record<string, string | number | boolean | undefined>;

export interface AuthUserPayload
  extends Record<string, string | number | string[] | undefined> {
  /**
   * Subject del JWT.
   * En esta app representa el ID de usuario (usuario_id) que se guarda
   * en el token al hacer login/refresh.
   * Tipado como string porque JWT spec usa strings para claims.
   */
  sub: string | number;

  /**
   * Correo del usuario autenticado.
   * Es opcional porque depende del payload que decidamos firmar.
   */
  email?: string;

  /**
   * Rol de negocio del usuario (CLIENTE, ADMINISTRACION, etc.).
   * Se usa para decisiones de autorización.
   * Almacenado como string en el JWT.
   */
  role?: string;

  /**
   * Expiration time (claim estándar JWT).
   * Valor en segundos UNIX, no viene de una entidad de BD.
   */
  exp?: number;

  /**
   * Issued at (claim estándar JWT).
   * Indica cuándo se emitió el token.
   */
  iat?: number;
}

/**
 * Extensión de la Request de Express para indicar que, tras pasar por AuthGuard,
 * la request puede incluir `user` con la estructura AuthUserPayload.
 *
 * Nota: `user` se marca opcional porque técnicamente existe solo en rutas
 * donde el guard de autenticación se ejecuta correctamente.
 */
export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}
