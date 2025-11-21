import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Pista } from "../pista/pista.entity";
import { Pago } from "../pago/pago.entity";

export enum estadoReserva {
    CONFIRMADA = "CONFIRMADA",
    FINALIZADA = "FINALIZADA",
    PAUSADA = "PAUSADA",
    CANCELADA = "CANCELADA",
    NO_PRESENTADO = "NO_PRESENTADO",
    PENDIENTE = "PENDIENTE",
}

@Entity()
export class Reserva {
    @PrimaryGeneratedColumn({name: "reserva_id", type: "int" })
    reserva_id: number;

    @Column({name: "usuario_id", type: "int" }) // Clave FK hacia Usuario
    usuario_id: number;

    @Column({name: "pista_id", type: "int" }) // Clave FK hacia Pista
    pista_id: number;

    @Column({name: "pago_id", type: "int", nullable: true }) // Clave FK hacia Pago (nullable por dependencia circular)
    pago_id: number | null;

    @Column()
    fecha_reserva: Date;

    @Column()
    fecha_inicio: Date;

    @Column()
    fecha_fin: Date;

    @Column({
        type: "enum",
        enum: estadoReserva,
        default: estadoReserva.PENDIENTE,
    })
    estado: estadoReserva;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    precio_total: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha_creacion: Date;

    @Column()
    codigo_reserva: string;

    @Column()
    nota: string;

    @ManyToOne(() => User, (u) => u.reservas)
    @JoinColumn({ name: "usuario_id" })
    usuario: User;

    @ManyToOne(() => Pista, (pi) => pi.reservas)
    @JoinColumn({ name: "pista_id" })
    pista: Pista;

    @OneToOne(() => Pago, (p) => p.reserva)
    @JoinColumn({ name: "pago_id" })
    pago: Pago;
}
