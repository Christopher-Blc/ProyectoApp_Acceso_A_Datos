import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Instalacion } from './instalacion.entity';
import { CreateInstalacionDto, UpdateInstalacionDto } from './instalacion.dto';

@Injectable()
export class InstalacionService {
    constructor(
        @InjectRepository(Instalacion)
        private readonly instalacionRepository: Repository<Instalacion>,
    ) {}

    async findAll(): Promise<Instalacion[]> {
        return this.instalacionRepository.find({ relations: ['pista'] });
    }

    async findOne(instalacion_id: number): Promise<Instalacion> {
        const instalacion = await this.instalacionRepository.findOne({
            where: { instalacion_id: instalacion_id },
            relations: ['pista'],
        });
        if (!instalacion) {
            throw new Error(`Instalacion ${instalacion_id} no encontrada`);
        }   
        return instalacion;
    }

    async create(info_instalacion: CreateInstalacionDto){
        const newInstalacion = this.instalacionRepository.create(info_instalacion)
        return this.instalacionRepository.save(newInstalacion);
    }

    async update(instalacion_id: number, info_instalacion: UpdateInstalacionDto): Promise<Instalacion>{
        await this.instalacionRepository.update(instalacion_id, info_instalacion);
        return this.findOne(instalacion_id);
    }

    async remove(instalacion_id: number): Promise<void>{
        await this.instalacionRepository.delete(instalacion_id);
    }
}
