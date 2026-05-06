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
          user_id: item.user_id,
          installation_id: item.installation_id, // Añadido para filtrar
          comment_date: item.comment_date,
        },
      });

      if (existing) {
        continue;
      }

      const reviewEntry = new Review();
      // Campos obligatorios según la entidad
      reviewEntry.installation_id = item.installation_id; // Campo corregido
      reviewEntry.user_id = item.user_id;
      reviewEntry.title = item.title;
      reviewEntry.text = item.text;
      reviewEntry.rating = item.rating;
      reviewEntry.comment_date = item.comment_date || new Date();
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
