import { Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import { Noti } from "../noti/noti.entity";
import { Comentario } from "../comentario/comentario.entity";
import { Reserva } from "../reserva/reserva.entity";
import { Membresia } from "../membresia/membresia.entity";
import { Pago } from "../pago/pago.entity";


export enum UserRole {
    GESTOR_RESERVAS = "GESTOR_RESERVAS",
    ADMINISTRACION = "ADMINISTRACION",
    CLIENTE = "CLIENTE",
    MANTENIMIENTO = "MANTENIMIENTO",
    SUPER_ADMIN = "SUPER_ADMIN",
}

@Entity({ name: "user" })
export class User {
    @PrimaryGeneratedColumn({ name: "usuario_id", type: "int" })
    usuario_id: number;

    @OneToMany(() => Noti, (n) => n.user)
    notificaciones: Noti[];

    @Column({ name: "name" })
    name: string;

    @Column({ name: "surname" })
    surname: string;

    @Column({ name: "email" })
    //@Unique(["email"])
    email: string;

    @Column({ name: "phone" })
    phone: string;

    @Column({ name: "password" })
    password: string;

    @Column({
        name: "role",
        type: "enum",
        enum: UserRole,
        default: UserRole.CLIENTE,
    })
    role: UserRole;

    @Column({ name: "isActive", default: true })
    isActive: boolean;

    @Column({ name: "fecha_registro", type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha_registro: Date;

    @Column({ name: "fecha_ultimo_login", type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha_ultimo_login: Date;

    @Column({ name: "fecha_nacimiento", type: 'date' })
    fecha_nacimiento: Date;

    @Column({ name: "direccion" })
    direccion: string;

    @Column({ nullable: true })
    refresh_token_hash: string | null;

    @OneToMany(() => Membresia, (m) => m.user)
    membresia: Membresia[];

    @OneToMany(() => Comentario, (c) => c.user)
    comentarios: Comentario[];

    @OneToMany(() => Pago, (p) => p.usuario)
    pagos: Pago[];

    @OneToMany(() => Reserva, (r) => r.usuario)
    reservas: Reserva[];
}
