import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Entidad que guarda los access tokens revocados (hashed) hasta su expiración
@Entity({ name: 'token_blacklist' })
export class AuthTokenBlacklist {
  // ID autoincremental de la fila
  @PrimaryGeneratedColumn({ name: 'token_blacklist_id', type: 'int' })
  token_blacklist_id: number;

  // Usuario dueño del token revocado
  @Column({ name: 'usuario_id', type: 'int' })
  usuario_id: number;

  // Hash SHA-256 del access token (nunca guardamos el token en claro)
  @Column({ name: 'token_hash', type: 'varchar', length: 64 })
  token_hash: string;

  // Fecha de expiración del token (para poder limpiar la tabla)
  @Column({ name: 'expires_at', type: 'timestamp' })
  expires_at: Date;

  // Momento de creación del registro
  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
