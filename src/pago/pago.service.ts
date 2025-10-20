import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pago } from './pago.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PagoService {

    constructor(
        @InjectRepository(Pago)
        private readonly pagoRepository: Repository<Pago>,
    ) {}

    findAll() {
        return this.pagoRepository.find({
            relations: ['user', 'reserva'],
        });
    }

    findOne(pago_id: number) {
        return this.pagoRepository.findOne({
            where: { pago_id },
            relations: ['user', 'reserva'],
        });
    }

    async create(data: Partial<Pago>) {
        const pago = this.pagoRepository.create(data);
        return this.pagoRepository.save(pago);
    }

    async update(pago_id: number, data: Partial<Pago>) {
        await this.pagoRepository.update(pago_id, data);
        return this.findOne(pago_id);
    }

    async remove(pago_id: number): Promise<void> {
        await this.pagoRepository.delete(pago_id)
    }
    
}
