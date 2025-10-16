import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comentario } from './comentario.entity';
import { ComentarioDto } from './comentario.dto';

@Injectable()
export class ComentarioService {
    constructor(
        @InjectRepository(Comentario)
        private comentarioRepository: Repository<Comentario>,
    ) {}

    async findAll(): Promise<Comentario[]> {
        return this.comentarioRepository.find({ relations: ['user', 'reserva', 'pista'] });
    }

    async findOne(comentario_id: number): Promise<Comentario> {
        const comentario = await this.comentarioRepository.findOne({
            where: { comentario_id: comentario_id },
            relations: ['user', 'reserva', 'pista'],
        });
        if (!comentario) {
            throw new Error(`Comentario ${comentario_id} no encontrado`);
        }
        return comentario;
    }

    async create(info_comentario: ComentarioDto){
        const newComentario = this.comentarioRepository.create(info_comentario)
        return this.comentarioRepository.save(newComentario);
    }

    async update(comentario_id: number, info_comentario: ComentarioDto): Promise<Comentario>{
        await this.comentarioRepository.update(comentario_id, info_comentario);
        return this.findOne(comentario_id);
    }

    async remove(comentario_id: number): Promise<void>{
        await this.comentarioRepository.delete(comentario_id);
    }
}
