import { Notification } from '../../../modules/notification/entities/notification.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import notificationData from '../../inventory/inventory_notification';

export class NotificationSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const notificationRepository = dataSource.getRepository(Notification);

    const notificationEntries: Notification[] = [];

    for (const item of notificationData) {
      const existing = await notificationRepository.findOne({
        where: {
          userId: item.userId,
          message: item.message,
          createdAt: item.createdAt,
        },
      });

      if (existing) {
        continue;
      }

      const notificationEntry = new Notification();
      // Campos que existen en la entidad
      notificationEntry.userId = item.userId;
      notificationEntry.message = item.message;
      notificationEntry.notificationType = item.notificationType;
      notificationEntry.isRead = item.isRead ?? false;
      notificationEntry.createdAt = item.createdAt || new Date();

      notificationEntries.push(notificationEntry);
    }

    if (notificationEntries.length > 0) {
      await notificationRepository.save(notificationEntries);
      console.log(`${notificationEntries.length} notifications created.`);
    }

    console.log('Notification seeding completed!');
  }
}
