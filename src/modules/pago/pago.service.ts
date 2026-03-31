import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pago } from './entities/pago.entity';
import { Repository } from 'typeorm';
import { UpdatePagoDto } from './dto/pago.dto';

@Injectable()
export class PagoService {

    constructor(
        @InjectRepository(Pago)
        private readonly pagoRepository: Repository<Pago>,
    ) {}

    findAll() {
        return this.pagoRepository.find({
            relations: ['usuario', 'reserva'],
        });
    }

    async findOne(pago_id: number): Promise<Pago> {
        const pago = await this.pagoRepository.findOne({
            where: { pago_id },
            relations: ['usuario', 'reserva'],
        });
        if (!pago) {
            throw new NotFoundException(`Pago ${pago_id} no encontrado`);
        }
        return pago;
    }

    async create(data: Partial<Pago>) {
        const pago = this.pagoRepository.create(data);
        return this.pagoRepository.save(pago);
    }

    async update(pago_id: number, data: UpdatePagoDto) {
        await this.pagoRepository.update(pago_id, data);
        return this.findOne(pago_id);
    }

    async remove(pago_id: number): Promise<void> {
        const pago = await this.findOne(pago_id);
        if (!pago) {
            throw new NotFoundException(`Pago ${pago_id} no encontrado`);
        }
        await this.pagoRepository.delete(pago_id);
    }
    
}






