import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Pista } from "../../pista/entities/pista.entity";
import { Pago } from "../../pago/entities/pago.entity";

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

    //reserva_Id estara en pago. he puesto onetomany aunque en teoria era onetoone
    //porque si falla un pago queremos todos los registros de pagos asociados a la reserva
    @OneToMany(() => Pago, (pago) => pago.reserva)
    pagos: Pago[]; // Esto es virtual, no crea una columna "pago_id" en la tabla reserva
}



