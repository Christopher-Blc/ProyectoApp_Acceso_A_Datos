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
          user_id: item.user_id,
          message: item.message,
          fecha: item.fecha,
        },
      });

      if (existing) {
        continue;
      }

      const notificationEntry = new Notification();
      // Campos que existen en la entidad
      notificationEntry.user_id = item.user_id;
      notificationEntry.message = item.message;
      notificationEntry.notification_type = item.notification_type;
      notificationEntry.read = item.read ?? false;
      notificationEntry.fecha = item.fecha || new Date();

      notificationEntries.push(notificationEntry);
    }

    if (notificationEntries.length > 0) {
      await notificationRepository.save(notificationEntries);
      console.log(`${notificationEntries.length} notifications created.`);
    }

    console.log('Notification seeding completed!');
  }
}
