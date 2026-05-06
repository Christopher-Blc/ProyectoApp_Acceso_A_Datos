import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Entidad que guarda los access tokens revocados (hashed) hasta su expiración
@Entity({ name: 'token_blacklist' })
export class AuthTokenBlacklist {
  // ID autoincremental de la fila
  @PrimaryGeneratedColumn({ name: 'token_blacklist_id', type: 'int' })
  id!: number;

  // Usuario dueño del token revocado
  @Column({ name: 'usuario_id', type: 'int' })
  userId!: number;

  // Hash SHA-256 del access token (nunca guardamos el token en claro)
  @Column({ name: 'token_hash', type: 'varchar', length: 64 })
  tokenHash!: string;

  // Fecha de expiración del token (para poder limpiar la tabla)
  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt!: Date;

  // Momento de creación del registro
  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}
