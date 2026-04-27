import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiaSemana, Pista } from './entities/pista.entity';
import { Between, Repository } from 'typeorm';
import { PistaDto, UpdatePistaDto } from './dto/pista.dto';
import { Reserva } from '../reserva/entities/reserva.entity';

@Injectable()
export class PistaService {

    constructor(
      @InjectRepository(Pista)
      private readonly pistaRepo: Repository<Pista>, // `pistaRepo` es el acceso a todas las operaciones de la tabla Pista
      @InjectRepository(Reserva)
      private readonly reservaRepo: Repository<Reserva>, // `reservaRepo` es el acceso a todas las operaciones de la tabla Reserva

    ) {}

    async findAll(): Promise<Pista[]>{

      return this.pistaRepo.find({relations: ['reservas', 'resenya', 'horarios_pista', 'instalacion']});
    } 



    async obtenerDisponibilidad(fechaString: string) {
      // 1. Convertir el string (2026-04-27) a objeto Date y sacar el día de la semana
      const fecha = new Date(fechaString);
      const dias = [
        DiaSemana.DOMINGO, DiaSemana.LUNES, DiaSemana.MARTES, 
        DiaSemana.MIERCOLES, DiaSemana.JUEVES, DiaSemana.VIERNES, DiaSemana.SABADO
      ];
      const nombreDia = dias[fecha.getDay()]; // Convierte el 0-6 de JS al Enum tuyo

      // 2. Buscar las pistas que abren ese día de la semana
      const pistas = await this.pistaRepo.find({
        where: { dia_semana: nombreDia },
        relations: ['tipo_pista'],
      });

      // 3. Buscar las reservas reales para ese día calendario específico
      const inicioDia = new Date(`${fechaString}T00:00:00.000Z`);
      const finDia = new Date(`${fechaString}T23:59:59.999Z`);

      const reservasDelDia = await this.reservaRepo.find({
        where: { fecha_reserva: Between(inicioDia, finDia) }
      });

      // 4. Mapear resultados
      return pistas.map(pista => {
        const reservasPista = reservasDelDia
          .filter(r => r.pista_id === pista.pista_id)
          .map(r => ({
            inicio: r.hora_inicio,
            fin: r.hora_fin
          }));

        return {
          ...pista,
          reservas_actuales: reservasPista
         };
      });
    }


      
      // --- Funciones auxiliares para manejar horas ---
      private parseHora(hora: string): number {
        const [h, m] = hora.split(':').map(Number);
        return h + m / 60;
      }

      private formatHora(decimal: number): string {
        const h = Math.floor(decimal);
        const m = (decimal % 1) * 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      }

      async findOne(pista_id: number ): Promise<Pista>{

        const pista = await this.pistaRepo.findOne({where: {pista_id: pista_id},
                                            relations: ['reservas', 'resenya', 'horarios_pista', 'instalacion']});
        if (!pista){
            throw new NotFoundException(`Pista ${pista_id} no encontrada`); // Lanzamos un error si no se encuentra la pista
        }
        return pista;
      }


    //crear una pista
    async create(info_pista: PistaDto): Promise<Pista>{

        //crear instancia de pista y pasarle sus datos
        const newPista = this.pistaRepo.create(info_pista)

        return this.pistaRepo.save(newPista);
    }

    async update(pista_id: number , info_pista : UpdatePistaDto): Promise<Pista>{

        //Actualizar pista con datos nuevos
        await this.pistaRepo.update(pista_id , info_pista);

        //devolvemos la pista llamando a findone
        return this.findOne(pista_id);

    }

    async remove(pista_id: number): Promise<void>{
        const pista = await this.findOne(pista_id);
        await this.pistaRepo.delete(pista_id);
    }
  }






