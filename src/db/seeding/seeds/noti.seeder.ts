import { Noti } from "../../../noti/noti.entity";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import notiData from '../../../data_info/inventory_noti'


export class NotiSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
        const notiRepository = dataSource.getRepository(Noti);

        const notiEntries: Noti[] = [];

        for (const item of notiData) {
            const existing = await notiRepository.findOne({
                where: {
                    mensaje: item.mensaje,
                    tipoNoti: item.tipoNoti,
                    fecha: item.fecha,
                },
            });
            if (existing) {
                continue;
            }

            const notiEntry = new Noti();
            notiEntry.mensaje = item.mensaje;
            notiEntry.tipoNoti = item.tipoNoti;
            notiEntry.leida = item.leida;
            notiEntry.fecha = item.fecha;

            notiEntries.push(notiEntry);
        }

        if (notiEntries.length > 0) {
            await notiRepository.save(notiEntries);
        }

        console.log('Noti seeding completed!')
    }
}