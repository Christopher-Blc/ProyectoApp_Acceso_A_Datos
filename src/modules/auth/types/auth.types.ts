import type { Request } from 'express';
import { UserRole } from '../../users/entities/user.entity';

/**
 * Este archivo concentra los tipos de autenticación que antes se repetían
 * en varios puntos del proyecto.
 *
 * Idea clave:
 * - El JWT se firma en AuthService con ciertos campos.
 * - AuthGuard valida el token y copia ese payload en req.user.
 * - Los controladores leen req.user con tipado fuerte, sin `any`.
 *
 * Beneficio principal:
 * - Evita errores de lint del tipo no-unsafe-member-access/no-unsafe-assignment.
 * - Hace explícito qué propiedades esperamos del usuario autenticado.
 */
export interface AuthUserPayload {
  /**
   * Subject del JWT.
   * En esta app representa el ID de usuario (usuario_id) que se guarda
   * en el token al hacer login/refresh.
   */
  sub: number;

  /**
   * Correo del usuario autenticado.
   * Es opcional porque depende del payload que decidamos firmar.
   */
  email?: string;

  /**
   * Rol de negocio del usuario (CLIENTE, ADMINISTRACION, etc.).
   * Se usa para decisiones de autorización.
   */
  role?: UserRole;

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
