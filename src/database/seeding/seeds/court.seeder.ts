import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import pistaData from '../../inventory/inventory_pista';
import { Court } from '../../../modules/court/entities/court.entity';

export class PistaSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const pistaRepository = dataSource.getRepository(Court);

    const pistaEntries: Court[] = [];

    for (const item of pistaData) {
      // We search for duplicates according to the @Unique constraint of the Entity
      const existing = await pistaRepository.findOne({
        where: {
          nombre: item.nombre,
          instalacion_id: item.instalacion_id,
          dia_semana: item.dia_semana,
        },
      });

      if (existing) {
        continue;
      }

      const pistaEntry = new Court();
      // Field assignment according to the Entity
      pistaEntry.instalacion_id = item.instalacion_id;
      pistaEntry.tipo_pista_id = item.tipo_pista_id;
      pistaEntry.nombre = item.nombre;
      pistaEntry.capacidad = item.capacidad;
      pistaEntry.precio_hora = item.precio_hora;
      pistaEntry.cubierta = item.cubierta; // boolean
      pistaEntry.iluminacion = item.iluminacion;
      pistaEntry.descripcion = item.descripcion;
      pistaEntry.estado = item.estado;
      pistaEntry.hora_apertura = item.hora_apertura;
      pistaEntry.hora_cierre = item.hora_cierre;
      pistaEntry.dia_semana = item.dia_semana;
      pistaEntry.reservations_made = item.reservations_made;

      pistaEntries.push(pistaEntry);
    }

    if (pistaEntries.length > 0) {
      await pistaRepository.save(pistaEntries);
      console.log(`${pistaEntries.length} pistas created.`);
    }
    console.log('Court seeding completed!');
  }
}


