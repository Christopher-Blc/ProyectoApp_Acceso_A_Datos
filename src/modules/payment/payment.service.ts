import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { UpdatePaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly pagoRepository: Repository<Payment>,
  ) {}

  findAll() {
    return this.pagoRepository.find({
      relations: ['usuario', 'Reservation'],
    });
  }

  async findOne(Payment_id: number): Promise<Payment> {
    const Payment = await this.pagoRepository.findOne({
      where: { Payment_id },
      relations: ['usuario', 'Reservation'],
    });
    if (!Payment) {
      throw new NotFoundException(`Payment ${Payment_id} no encontrado`);
    }
    return Payment;
  }

  async create(data: Partial<Payment>) {
    const Payment = this.pagoRepository.create(data);
    return this.pagoRepository.save(Payment);
  }

  async update(Payment_id: number, data: UpdatePaymentDto) {
    await this.pagoRepository.update(Payment_id, data);
    return this.findOne(Payment_id);
  }

  async remove(Payment_id: number): Promise<void> {
    const Payment = await this.findOne(Payment_id);
    if (!Payment) {
      throw new NotFoundException(`Payment ${Payment_id} no encontrado`);
    }
    await this.pagoRepository.delete(Payment_id);
  }
}


