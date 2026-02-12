import { Comentario } from "../../../comentario/comentario.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import comentarioData from "../../../data_info/inventory_comentario";

export class ComentarioSeeder implements Seeder{
    public async run(dataSource: DataSource): Promise<any>{
        const comentarioRepository = dataSource.getRepository(Comentario);

        const comentarioEntries: Comentario[] = [];

        for (const item of comentarioData) {
            const existing = await comentarioRepository.findOne({
                where: {
                    pista_id: item.pista_id,
                    usuario_id: item.usuario_id,
                    titulo: item.titulo,
                    fecha_comentario: item.fecha_comentario,
                },
            });
            if (existing) {
                continue;
            }

            const comentarioEntry = new Comentario();
            comentarioEntry.pista_id = item.pista_id;
            comentarioEntry.usuario_id = item.usuario_id;
            comentarioEntry.titulo = item.titulo;
            comentarioEntry.texto = item.texto;
            comentarioEntry.calificacion = item.calificacion;
            comentarioEntry.fecha_comentario = item.fecha_comentario;
            comentarioEntry.visible = item.visible;

            comentarioEntries.push(comentarioEntry);
        }

        if (comentarioEntries.length > 0) {
            await comentarioRepository.save(comentarioEntries);
        }
        console.log("Comentario seeding completado!");
    }
}