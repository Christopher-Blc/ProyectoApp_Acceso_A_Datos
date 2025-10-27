import { Pago } from "../../../pago/pago.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import pagoData from "../../../data_info/inventory_pago";

export class PagoSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
        const pagoRepository = dataSource.getRepository(Pago);

        const pagosEntries = await Promise.all(
            pagoData.map(async (item) => {
                    const pagoEntry = new Pago();

                    pagoEntry.reserva_id = item.reserva_id;
                    pagoEntry.usuario_id = item.usuario_id;
                    pagoEntry.monto = item.monto;
                    pagoEntry.fecha_pago = item.fecha_pago;
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