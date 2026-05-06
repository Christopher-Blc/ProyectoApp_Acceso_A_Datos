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
          userId: item.userId,
          installationId: item.installationId, // Añadido para filtrar
          commentDate: item.commentDate,
        },
      });

      if (existing) {
        continue;
      }

      const reviewEntry = new Review();
      // Campos obligatorios según la entidad
      reviewEntry.installationId = item.installationId; // Campo corregido
      reviewEntry.userId = item.userId;
      reviewEntry.title = item.title;
      reviewEntry.text = item.text;
      reviewEntry.rating = item.rating;
      reviewEntry.commentDate = item.commentDate || new Date();
      reviewEntry.isVisible = item.isVisible ?? true;

      reviewEntries.push(reviewEntry);
    }

    if (reviewEntries.length > 0) {
      await reviewRepository.save(reviewEntries);
      console.log(`${reviewEntries.length} reviews created.`);
    }
    console.log('Review seeding completed!');
  }
}
