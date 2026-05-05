import { Review } from '../../../modules/review/entities/review.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import comentarioData from '../../inventory/inventory_review';

export class ReviewSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const reviewRepository = dataSource.getRepository(Review);

    const reviewEntries: Review[] = [];

    for (const item of comentarioData) {
      // Buscamos duplicados por usuario, instalación y fecha
      const existing = await reviewRepository.findOne({
        where: {
          usuario_id: item.usuario_id,
          instalacion_id: item.instalacion_id, // Añadido para filtrar
          fecha_comentario: item.fecha_comentario,
        },
      });

      if (existing) {
        continue;
      }

      const reviewEntry = new Review();
      // Campos obligatorios según la entidad
      reviewEntry.instalacion_id = item.instalacion_id; // Campo corregido
      reviewEntry.usuario_id = item.usuario_id;
      reviewEntry.titulo = item.titulo;
      reviewEntry.texto = item.texto;
      reviewEntry.calificacion = item.calificacion;
      reviewEntry.fecha_comentario = item.fecha_comentario || new Date();
      reviewEntry.visible = item.visible ?? true;

      reviewEntries.push(reviewEntry);
    }

    if (reviewEntries.length > 0) {
      await reviewRepository.save(reviewEntries);
      console.log(`${reviewEntries.length} reviews created.`);
    }
    console.log('Review seeding completed!');
  }
}


