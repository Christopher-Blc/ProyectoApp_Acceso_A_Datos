import { Injectable } from '@nestjs/common';
import { Horario_Pista } from './horario_pista.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateHorarioPistaDto } from './horario_pista.dto';

@Injectable()
export class HorarioPistaService {

    constructor(
        @InjectRepository(Horario_Pista)
        private readonly horarioPistaRepository: Repository<Horario_Pista>,
    ) {}

    findAll() {
        return this.horarioPistaRepository.find({
            relations: ['pista'], // Asegúrate de cargar la relación con Pista si es necesario
        });
    }

    findOne(horario_id: number) {
        return this.horarioPistaRepository.findOne({
            where: { horario_id },
            relations: ['pista'],
    });
    }

    async create(data: Partial<Horario_Pista>) {
        const horarioPista = this.horarioPistaRepository.create(data);
        return this.horarioPistaRepository.save(horarioPista);
    }

    async update(horario_id: number, data: UpdateHorarioPistaDto) {
        await this.horarioPistaRepository.update(horario_id, data);
        return this.findOne(horario_id);
    }

    async remove(horario_id: number) {
        await this.horarioPistaRepository.delete(horario_id);
        return { deleted: true };
    }
}   
