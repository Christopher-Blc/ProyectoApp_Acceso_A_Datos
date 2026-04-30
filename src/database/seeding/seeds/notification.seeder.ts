import { Notification } from '../../../modules/notification/entities/notification.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import notiData from '../../inventory/inventory_noti';

export class NotiSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const notiRepository = dataSource.getRepository(Noti);

    const notiEntries: Notification[] = [];

    for (const item of notiData) {
      const existing = await notiRepository.findOne({
        where: {
          user_id: item.user_id,
          mensaje: item.mensaje,
          fecha: item.fecha,
        },
      });

      if (existing) {
        continue;
      }

      const notiEntry = new Notification();
      // Fields that exist in your Entity [cite: 162-165]
      notiEntry.user_id = item.user_id;
      notiEntry.mensaje = item.mensaje;
      notiEntry.tipoNotification = item.tipoNoti;
      notiEntry.leida = item.leida ?? false;
      notiEntry.fecha = item.fecha || new Date();

      notiEntries.push(notiEntry);
    }

    if (notiEntries.length > 0) {
      await notiRepository.save(notiEntries);
      console.log(`${notiEntries.length} notifications created.`);
    }

    console.log('Notification seeding completed!');
  }
}


