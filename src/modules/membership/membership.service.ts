import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from './entities/membership.entity';
import { CreateMembershipDto, UpdateMembershipDto } from './dto/membership.dto';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private readonly Repo: Repository<Membership>,
  ) {}

  async findAll(): Promise<Membership[]> {
    return this.Repo.find();
  }

  async findOne(Membership_id: number): Promise<Membership> {
    const Membership = await this.Repo.findOne({
      where: { Membership_id: Membership_id },
    });
    if (!Membership) {
      throw new NotFoundException(`Membership ${Membership_id} no encontrada`);
    }
    return Membership;
  }

  async create(info_Membership: CreateMembershipDto) {
    const newMembership = this.Repo.create(info_Membership);
    return this.Repo.save(newMembership);
  }

  async update(
    Membership_id: number,
    info_Membership: UpdateMembershipDto,
  ): Promise<Membership> {
    await this.Repo.update(Membership_id, info_Membership);
    return this.findOne(Membership_id);
  }

  async remove(Membership_id: number): Promise<void> {
    await this.Repo.delete(Membership_id);
  }
}



