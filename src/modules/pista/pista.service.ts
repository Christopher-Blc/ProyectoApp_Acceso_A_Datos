import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pista } from './pista.entity';
import { Repository } from 'typeorm';
import { PistaDto, UpdatePistaDto } from './pista.dto';

@Injectable()
export class PistaService {

    constructor(
        @InjectRepository(Pista)
        private readonly pistaRepo: Repository<Pista>, // `userRepo` es el acceso a todas las operaciones de la tabla User
      ) {}

      async findAll(): Promise<Pista[]>{

        return this.pistaRepo.find({relations: ['reservas', 'comentarios', 'horarios_pista', 'instalacion']});
      } 

      async findOne(pista_id: number ): Promise<Pista>{

        const pista = await this.pistaRepo.findOne({where: {pista_id: pista_id},
                                            relations: ['reservas', 'comentarios', 'horarios_pista', 'instalacion']});
        if (!pista){
            throw new Error(`Usuario ${pista_id} no encontrado`); // Lanzamos un error si no se encuentra la pista
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

        await this.pistaRepo.delete(pista_id);
    }
  }
