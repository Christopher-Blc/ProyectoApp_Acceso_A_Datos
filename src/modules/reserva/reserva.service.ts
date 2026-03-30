import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from './reserva.entity';
import { CreateReservaDto, UpdateReservaDto } from './reserva.dto';

@Injectable()
export class ReservaService {
    constructor(
        @InjectRepository(Reserva)
        private readonly reservaRepo: Repository<Reserva>,
    ) {}

    async findAll(): Promise<Reserva[]> {
        return this.reservaRepo.find({ relations: ['usuario', 'pista', 'pago'] });
    }

    async findOne(reserva_id: number): Promise<Reserva> {
        const reserva = await this.reservaRepo.findOne({
            where: { reserva_id: reserva_id },
            relations: ['usuario', 'pista', 'pago'],
        });
        if (!reserva) {
            throw new Error(`Reserva ${reserva_id} no encontrada`);
        }
        return reserva;
    }

    async create(info_reserva: CreateReservaDto){
        const newReserva = this.reservaRepo.create(info_reserva);
        const saved = await this.reservaRepo.save(newReserva);
        return this.findOne(saved.reserva_id);
    }

    async update(reserva_id: number, info_reserva: UpdateReservaDto): Promise<Reserva>{
        await this.reservaRepo.update(reserva_id, info_reserva);
        return this.findOne(reserva_id);
    }

    async remove(reserva_id: number): Promise<void>{
        await this.reservaRepo.delete(reserva_id);
    }
}
