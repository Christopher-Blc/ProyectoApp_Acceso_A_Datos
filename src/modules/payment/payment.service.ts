import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { UpdatePaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentService {
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
    const Payment = await this.pagoRepository.findOne({
      where: { pago_id },
      relations: ['usuario', 'reserva'],
    });
    if (!pago) {
      throw new NotFoundException(`Payment ${pago_id} no encontrado`);
    }
    return pago;
  }

  async create(data: Partial<Pago>) {
    const Payment = this.pagoRepository.create(data);
    return this.pagoRepository.save(pago);
  }

  async update(pago_id: number, data: UpdatePaymentDto) {
    await this.pagoRepository.update(pago_id, data);
    return this.findOne(pago_id);
  }

  async remove(pago_id: number): Promise<void> {
    const Payment = await this.findOne(pago_id);
    if (!pago) {
      throw new NotFoundException(`Payment ${pago_id} no encontrado`);
    }
    await this.pagoRepository.delete(pago_id);
  }
}

