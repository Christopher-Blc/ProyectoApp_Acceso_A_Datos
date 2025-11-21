import { Instalacion } from "../../../instalacion/instalacion.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import instalacionData from "../../../data_info/inventory_instalacion";

export class InstalacionSeeder implements Seeder{
    public async run(dataSource: DataSource): Promise<any>{
        const instalacionRepository = dataSource.getRepository(Instalacion);

        const instalacionEntries = await Promise.all(
            instalacionData.map(async (item) => {
                const instalacionEntry = new Instalacion();

                instalacionEntry.nombre = item.nombre;
                instalacionEntry.direccion = item.direccion;
                instalacionEntry.telefono = item.telefono;
                instalacionEntry.email = item.email;
                instalacionEntry.capacidad_max = item.capacidad_max;
                instalacionEntry.descripcion = item.descripcion;
                instalacionEntry.fecha_creacion = item.fecha_creacion;
                instalacionEntry.estado = item.estado;
                instalacionEntry.horario_apertura = item.horario_apertura;
                instalacionEntry.horario_cierre = item.horario_cierre;

                return instalacionEntry;
            }),
        );
        await instalacionRepository.save(instalacionEntries);
        console.log("Instalacion seeding completado!");
    }
}