import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Reserva } from "../../reserva/entities/reserva.entity";

export enum metodo_pago {
    VISA = "Visa",
    MASTERCARD = "MasterCard",
    PAY_PAL = "PayPal",
    BIZUM = "Bizum",
    EFECTIVO = "Efectivo"
}

export enum estado_pago {
    PAGADO = "Pagado",
    NO_PAGADO = "No pagado",
    EN_PROCESO = "En proceso",
    REEMBOLSADO = "Reembolsado"
}

@Entity()
export class Pago {
    @PrimaryGeneratedColumn({name: "pago_id", type: "int" })
    pago_id: number;

    @Column({ type: "decimal" })
    monto: number;

    @Column()
    fecha_pago: Date;

    @Column({
        type: "enum",
        enum: metodo_pago,
        default: metodo_pago.VISA,
    })
    metodo_pago: metodo_pago;

    @Column({
        type: "enum",
        enum: estado_pago,
        default: estado_pago.NO_PAGADO,
    })
    estado_pago: estado_pago;

    @Column({ name: "usuario_id", type: "int", nullable: true })
    usuario_id?: number;

    @Column({ nullable: true })
    nota?: string;

    @ManyToOne(() => User, (u) => u.pagos, {nullable: true})
    @JoinColumn({ name: "usuario_id" })
    usuario: User;

    @OneToOne(() => Reserva, (r) => r.pago)
    @JoinColumn({ name: "reserva_id" })
    reserva: Reserva;
}

