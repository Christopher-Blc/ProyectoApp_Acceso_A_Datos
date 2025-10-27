import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import  horariopistaData from '../../../data_info/inventory_horario_pista';
import { Horario_Pista } from "../../../horario_pista/horario_pista.entity";

export class Horario_PistaSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
        const horario_pistaRepository = dataSource.getRepository(Horario_Pista);

        const horarioPistaEntries = await Promise.all(
            horariopistaData.map(async (item) => {

            const horariopistaEntry = new Horario_Pista();

            horariopistaEntry.dia_semana = item.dia_semana;
            horariopistaEntry.hora_apertura = item.hora_apertura;
            horariopistaEntry.hora_cierre = item.hora_cierre;
            horariopistaEntry.intervalos_minutos = item.intervalos_minutos;
            }),
        );
    }

}