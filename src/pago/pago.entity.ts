import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Double } from "typeorm/browser";

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
export class User {
  @PrimaryGeneratedColumn({type: "int"})
  pago_id: number;

  @Column()
  reserva_id: string;//llave secundaria que viene de la tabla reserva

  @Column()
  usuario_id: string;//llave secundaria que viene de la tabla usuario

  @Column({type: "decimal"})
  monto: number;

  @Column()
  fecha_pago: Date;

  @Column({
      type: "enum",
      enum: metodo_pago,
      default: metodo_pago.VISA, // valor por defecto
    })
    metodo_pago: metodo_pago;


  @Column({
      type: "enum",
      enum: estado_pago,
      default: estado_pago.NO_PAGADO, // valor por defecto
    })
    estado_pago: estado_pago;

  @Column()
  nota: string;


  

}