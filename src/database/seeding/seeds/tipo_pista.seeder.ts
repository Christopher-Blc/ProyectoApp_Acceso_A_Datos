import { TipoPista } from "../../../modules/tipo_pista/entities/tipo_pista.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import tipoPistaData from "../../inventory/inventory_tipo_pista";

export class TipoPistaSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
        const tipoPistaRepository = dataSource.getRepository(TipoPista);

        const entries: TipoPista[] = [];

        for (const item of tipoPistaData) {
            // Buscamos por nombre para evitar duplicados
            const existing = await tipoPistaRepository.findOne({
                where: { nombre: item.nombre },
            });
            
            if (existing) continue;

            const entry = new TipoPista();
            // Solo tiene id (auto) y nombre según tu Entity 
            entry.nombre = item.nombre;

            entries.push(entry);
        }

        if (entries.length > 0) {
            await tipoPistaRepository.save(entries);
            console.log(`${entries.length} tipos de pista creados.`);
        }
        console.log("TipoPista seeding completado!");
    }
}