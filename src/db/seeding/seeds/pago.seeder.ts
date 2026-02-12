import { Pago } from "../../../pago/pago.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import pagoData from "../../../data_info/inventory_pago"; 
import { User } from "../../../users/user.entity";
import { Reserva } from "../../../reserva/reserva.entity";

export class PagoSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
        const pagoRepository = dataSource.getRepository(Pago);
        const userRepository = dataSource.getRepository(User);
        const reservaRepository = dataSource.getRepository(Reserva);

        const pagosEntries: Pago[] = [];

        for (const item of pagoData) {
            const usuario = await userRepository.findOne({ where: { usuario_id: Number(item.usuario_id) } });
            const reserva = await reservaRepository.findOne({ where: { reserva_id: Number(item.reserva_id) } });

            if (!usuario) throw new Error(`Usuario con id ${item.usuario_id} no encontrado`);
            if (!reserva) throw new Error(`Reserva con id ${item.reserva_id} no encontrada`);

            const existing = await pagoRepository.findOne({
                where: {
                    monto: item.monto,
                    fecha_pago: new Date(item.fecha_pago),
                    metodo_pago: item.metodo_pago,
                    estado_pago: item.estado_pago,
                    usuario: { usuario_id: Number(item.usuario_id) },
                },
                relations: { usuario: true },
            });
            if (existing) {
                continue;
            }

            const pagoEntry = new Pago();
            pagoEntry.usuario = usuario;
            pagoEntry.reserva = reserva;
            pagoEntry.monto = item.monto;
            pagoEntry.fecha_pago = new Date(item.fecha_pago);
            pagoEntry.metodo_pago = item.metodo_pago;
            pagoEntry.estado_pago = item.estado_pago;
            pagoEntry.nota = item.nota;

            pagosEntries.push(pagoEntry);
        }

        if (pagosEntries.length > 0) {
            await pagoRepository.save(pagosEntries);
        }
        console.log("Pago seeding completado!");
    }
}
