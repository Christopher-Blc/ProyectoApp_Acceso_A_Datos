import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membresia } from './membresia.entity';
import { CreateMembresiaDto, UpdateMembresiaDto } from './membresia.dto';

@Injectable()
export class MembresiaService {
    constructor(
            @InjectRepository(Membresia)
            private readonly Repo: Repository<Membresia>,
        ) {}


        async findAll(): Promise<Membresia[]> {
            return this.Repo.find({ relations: ['user'] });
        }

        async findOne(membresia_id: number): Promise<Membresia> {
            const membresia = await this.Repo.findOne({
                where: { membresia_id: membresia_id },
                relations: ['user'],
            });
            if (!membresia) {
                throw new Error(`Membresia ${membresia_id} no encontrada`);
            }
            return membresia;
        }

        async create(info_membresia: CreateMembresiaDto){
            const newMembresia = this.Repo.create(info_membresia)
            return this.Repo.save(newMembresia);
        }

        async update(membresia_id: number, info_membresia: UpdateMembresiaDto): Promise<Membresia>{
            await this.Repo.update(membresia_id, info_membresia);
            return this.findOne(membresia_id);
        }

        async remove(membresia_id: number): Promise<void>{
            await this.Repo.delete(membresia_id);
        }
}
