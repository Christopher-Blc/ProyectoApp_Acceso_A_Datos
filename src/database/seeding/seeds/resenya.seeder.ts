import { Resenya } from "../../../modules/resenya/entities/resenya.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import comentarioData from "../../inventory/inventory_comentario";

export class ResenyaSeeder implements Seeder{
    public async run(dataSource: DataSource): Promise<any>{
        const resenyaRepository = dataSource.getRepository(Resenya);

        const resenyaEntries: Resenya[] = [];

        for (const item of comentarioData) {
            const existing = await resenyaRepository.findOne({
                where: {
                    usuario_id: item.usuario_id,
                    titulo: item.titulo,
                    fecha_comentario: item.fecha_comentario,
                },
            });
            if (existing) {
                continue;
            }

            const resenyaEntry = new Resenya();
            resenyaEntry.usuario_id = item.usuario_id;
            resenyaEntry.titulo = item.titulo;
            resenyaEntry.texto = item.texto;
            resenyaEntry.calificacion = item.calificacion;
            resenyaEntry.fecha_comentario = item.fecha_comentario;
            resenyaEntry.visible = item.visible;

            resenyaEntries.push(resenyaEntry);
        }

        if (resenyaEntries.length > 0) {
            await resenyaRepository.save(resenyaEntries);
        }
        console.log("Reseña seeding completado!");
    }
}


