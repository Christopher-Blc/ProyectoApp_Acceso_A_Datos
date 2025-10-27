import { Noti } from "src/noti/noti.entity";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import notiData from '../../../data_info/inventory_noti'


export class NotiSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
        const notiRepository = dataSource.getRepository(Noti);

        const notiEntries = await Promise.all(
            notiData.map(async (item) => {
                const notiEntry = new Noti();

                notiEntry.noti_id = item.noti_id;
                notiEntry.mensaje = item.mensaje;
                notiEntry.tipoNoti = item.tipoNoti;
                notiEntry.leida = item.leida;
                notiEntry.fecha = item.fecha;

                return notiEntry;
         }),
        );
        await notiRepository.save(notiEntries);

        console.log('Noti seeding completed!')
    }
}