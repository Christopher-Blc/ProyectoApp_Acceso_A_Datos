import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from './reserva.entity';
import { CreateReservaDto } from './reserva.dto';

@Injectable()
export class ReservaService {
    constructor(
        @InjectRepository(Reserva)
        private readonly reservaRepo: Repository<Reserva>,
    ) {}

    async findAll(): Promise<Reserva[]> {
        return this.reservaRepo.find({ relations: ['user', 'pista', 'pago'] });
    }

    async findOne(reserva_id: number): Promise<Reserva> {
        const reserva = await this.reservaRepo.findOne({
            where: { reserva_id: reserva_id },
            relations: ['user', 'pista', 'pago'],
        });
        if (!reserva) {
            throw new Error(`Reserva ${reserva_id} no encontrada`);
        }
        return reserva;
    }

    async create(info_reserva: CreateReservaDto){
        const newReserva = this.reservaRepo.create(info_reserva)
        return this.reservaRepo.save(newReserva);
    }

    async update(reserva_id: number, info_reserva: CreateReservaDto): Promise<Reserva>{
        await this.reservaRepo.update(reserva_id, info_reserva);
        return this.findOne(reserva_id);
    }

    async remove(reserva_id: number): Promise<void>{
        await this.reservaRepo.delete(reserva_id);
    }
}
