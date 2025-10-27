import { Comentario } from "../../../comentario/comentario.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import comentarioData from "../../../data_info/inventory_comentario";

export class ComentarioSeeder implements Seeder{
    public async run(dataSource: DataSource): Promise<any>{
        const comentarioRepository = dataSource.getRepository(Comentario);

        const comentarioEntries = await Promise.all(
            comentarioData.map(async (item) => {
                const comentarioEntry = new Comentario();

                comentarioEntry.titulo = item.titulo;
                comentarioEntry.texto = item.texto;
                comentarioEntry.calificacion = item.calificacion;
                comentarioEntry.fecha_comentario = item.fecha_comentario;
                comentarioEntry.visible = item.visible;
                
                return comentarioEntry;
            }),
        );
        await comentarioRepository.save(comentarioEntries);
        console.log("Comentario seeding completado!");
    }
}