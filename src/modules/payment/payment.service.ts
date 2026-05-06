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
      relations: ['reservation'],
    });
  }

  async findOne(paymentId: number): Promise<Payment> {
    const payment = await this.pagoRepository.findOne({
      where: { id: paymentId },
      relations: ['reservation'],
    });
    if (!payment) {
      throw new NotFoundException(`Payment ${paymentId} not found`);
    }
    return payment;
  }

  async create(data: Partial<Payment>) {
    const payment = this.pagoRepository.create(data);
    return this.pagoRepository.save(payment);
  }

  async update(paymentId: number, data: UpdatePaymentDto) {
    await this.pagoRepository.update(paymentId, data);
    return this.findOne(paymentId);
  }

  async remove(paymentId: number): Promise<void> {
    await this.findOne(paymentId);
    await this.pagoRepository.delete(paymentId);
  }
}
