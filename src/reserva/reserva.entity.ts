import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne, OneToOne } from "typeorm";
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
    @PrimaryGeneratedColumn({ type: "int" })
    reserva_id: number;

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

    @ManyToMany(() => User, user => user.reservas)
    usuarios: User[];

    @ManyToOne(() => Pista, pista => pista.reservas)
    pista: Pista;

    @OneToOne(() => Pago, pago => pago.reserva)
    pago: Pago;
}
