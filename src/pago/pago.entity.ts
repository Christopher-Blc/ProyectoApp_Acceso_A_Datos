import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Reserva } from "../reserva/reserva.entity";

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

    @Column()
    nota: string;

    @ManyToOne(() => User, (u) => u.pagos, {nullable: true})
    @JoinColumn({ name: "usuario_id" })
    usuario: User;

    @OneToOne(() => Reserva, (r) => r.pago)
    reserva: Reserva;
}
