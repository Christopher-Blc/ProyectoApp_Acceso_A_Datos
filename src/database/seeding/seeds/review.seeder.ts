import { Review } from '../../../modules/review/entities/review.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import comentarioData from '../../inventory/inventory_resenya';

export class ResenyaSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const resenyaRepository = dataSource.getRepository(Resenya);

    const resenyaEntries: Review[] = [];

    for (const item of comentarioData) {
      // We search for duplicates by user, facility and date
      const existing = await resenyaRepository.findOne({
        where: {
          usuario_id: item.usuario_id,
          instalacion_id: item.instalacion_id, // Added for filtering
          fecha_comentario: item.fecha_comentario,
        },
      });

      if (existing) {
        continue;
      }

      const resenyaEntry = new Review();
      // Mandatory fields according to the Entity
      resenyaEntry.instalacion_id = item.instalacion_id; // Corrected field
      resenyaEntry.usuario_id = item.usuario_id;
      resenyaEntry.titulo = item.titulo;
      resenyaEntry.texto = item.texto;
      resenyaEntry.calificacion = item.calificacion;
      resenyaEntry.fecha_comentario = item.fecha_comentario || new Date();
      resenyaEntry.visible = item.visible ?? true;

      resenyaEntries.push(resenyaEntry);
    }

    if (resenyaEntries.length > 0) {
      await resenyaRepository.save(resenyaEntries);
      console.log(`${resenyaEntries.length} reviews created.`);
    }
    console.log('Review seeding completed!');
  }
}


