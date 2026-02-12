import { Seeder } from "typeorm-extension";
import { DataSource } from "typeorm";
import pistaData from "../../../data_info/inventory_pista";
import { Pista } from '../../../pista/pista.entity';
import * as bcrypt from 'bcryptjs';


export class pistaSeed implements Seeder{

    public async run(datasource: DataSource): Promise<any>{
        const pistaRepository = datasource.getRepository(Pista)

        const pistaEntries: Pista[] = [];

        for (const item of pistaData) {
            const existing = await pistaRepository.findOne({
                where: { instalacion_id: item.instalacion_id, numero: item.numero },
            });
            if (existing) {
                continue;
            }

            const pistaEntry = new Pista();
            pistaEntry.instalacion_id = item.instalacion_id;
            pistaEntry.tipo_Pista = item.tipo_pista;
            pistaEntry.capacidad = item.capacidad;
            pistaEntry.precio_hora = item.precio_hora;
            pistaEntry.cobertura = item.cobertura;
            pistaEntry.iluminacion = item.iluminacion;
            pistaEntry.descripcion = item.descripcion;
            pistaEntry.estado = item.estado;
            pistaEntry.numero = item.numero;

            pistaEntries.push(pistaEntry);
        }

        if (pistaEntries.length > 0) {
            await pistaRepository.save(pistaEntries);
        }
        console.log('Pista Seeding completed!');
    }
    
}
