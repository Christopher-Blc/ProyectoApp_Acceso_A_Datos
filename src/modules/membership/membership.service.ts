import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from './entities/membership.entity';
import { CreateMembershipDto, UpdateMembershipDto } from './dto/membership.dto';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membresia)
    private readonly Repo: Repository<Membresia>,
  ) {}

  async findAll(): Promise<Membership[]> {
    return this.Repo.find();
  }

  async findOne(membresia_id: number): Promise<Membresia> {
    const Membership = await this.Repo.findOne({
      where: { membresia_id: membresia_id },
    });
    if (!membresia) {
      throw new NotFoundException(`Membership ${membresia_id} no encontrada`);
    }
    return membresia;
  }

  async create(info_membresia: CreateMembershipDto) {
    const newMembership = this.Repo.create(info_membresia);
    return this.Repo.save(newMembresia);
  }

  async update(
    membresia_id: number,
    info_membresia: UpdateMembershipDto,
  ): Promise<Membresia> {
    await this.Repo.update(membresia_id, info_membresia);
    return this.findOne(membresia_id);
  }

  async remove(membresia_id: number): Promise<void> {
    await this.Repo.delete(membresia_id);
  }
}


