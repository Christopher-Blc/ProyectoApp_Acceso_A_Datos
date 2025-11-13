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

        const pagosEntries = await Promise.all(
            pagoData.map(async (item) => {
                const pagoEntry = new Pago();

                // Convertimos IDs a numbers y buscamos las entidades relacionadas
                // Aqui hacemos las conversiones necesarias y busquedas
                const usuario = await userRepository.findOne({ where: { usuario_id: Number(item.usuario_id) } });
                const reserva = await reservaRepository.findOne({ where: { reserva_id: Number(item.reserva_id) } });

                // Aqui hacemos comprobaciones de existencia, para evitar errores
                if (!usuario) throw new Error(`Usuario con id ${item.usuario_id} no encontrado`);
                if (!reserva) throw new Error(`Reserva con id ${item.reserva_id} no encontrada`);

                pagoEntry.usuario = usuario;
                pagoEntry.reserva = reserva;

                pagoEntry.monto = item.monto;
                pagoEntry.fecha_pago = new Date(item.fecha_pago);
                pagoEntry.metodo_pago = item.metodo_pago;
                pagoEntry.estado_pago = item.estado_pago;
                pagoEntry.nota = item.nota;

                return pagoEntry;
            }),
        );

        await pagoRepository.save(pagosEntries);
        console.log("Pago seeding completado!");
    }
}
