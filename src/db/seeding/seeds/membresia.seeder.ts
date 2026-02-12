import { Membresia } from "../../../membresia/membresia.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import membresiaData from "../../../data_info/inventory_membresia";

export class MembresiaSeeder implements Seeder{
    public async run(dataSource: DataSource): Promise<any>{
        const membresiaRepository = dataSource.getRepository(Membresia);

        const membresiaEntries: Membresia[] = [];

        for (const item of membresiaData) {
            const existing = await membresiaRepository.findOne({
                where: {
                    usuario_id: item.usuario_id,
                    tipo: item.tipo,
                    fecha_inicio: item.fecha_inicio,
                },
            });
            if (existing) {
                continue;
            }

            const membresiaEntry = new Membresia();
            membresiaEntry.usuario_id = item.usuario_id;
            membresiaEntry.tipo = item.tipo;
            membresiaEntry.fecha_inicio = item.fecha_inicio;
            membresiaEntry.fecha_fin = item.fecha_fin;
            membresiaEntry.estado = item.estado;
            membresiaEntry.descuento = item.descuento;
            membresiaEntry.renovable = item.renovable;
            membresiaEntry.fecha_renovacion = item.fecha_renovacion;
            membresiaEntries.push(membresiaEntry);
        }

        if (membresiaEntries.length > 0) {
            await membresiaRepository.save(membresiaEntries);
        }
        console.log("Membresia seeding completado!");
    }
}