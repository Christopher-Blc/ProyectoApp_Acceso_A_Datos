import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import courtData from '../../inventory/inventory_court';
import { Court } from '../../../modules/court/entities/court.entity';

export class CourtSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const courtRepository = dataSource.getRepository(Court);

    const courtEntries: Court[] = [];

    for (const item of courtData) {
      // Buscamos duplicados según la restricción @Unique de la entidad
      const existing = await courtRepository.findOne({
        where: {
          nombre: item.nombre,
          instalacion_id: item.instalacion_id,
          dia_semana: item.dia_semana,
        },
      });

      if (existing) {
        continue;
      }

      const courtEntry = new Court();
      // Asignación de campos según la entidad
      courtEntry.instalacion_id = item.instalacion_id;
      courtEntry.tipo_pista_id = item.tipo_pista_id;
      courtEntry.nombre = item.nombre;
      courtEntry.capacidad = item.capacidad;
      courtEntry.precio_hora = item.precio_hora;
      courtEntry.cubierta = item.cubierta; // booleano
      courtEntry.iluminacion = item.iluminacion;
      courtEntry.descripcion = item.descripcion;
      courtEntry.estado = item.estado;
      courtEntry.hora_apertura = item.hora_apertura;
      courtEntry.hora_cierre = item.hora_cierre;
      courtEntry.dia_semana = item.dia_semana;
      courtEntry.reservations_made = item.reservations_made;

      courtEntries.push(courtEntry);
    }

    if (courtEntries.length > 0) {
      await courtRepository.save(courtEntries);
      console.log(`${courtEntries.length} pistas created.`);
    }
    console.log('Court seeding completed!');
  }
}


