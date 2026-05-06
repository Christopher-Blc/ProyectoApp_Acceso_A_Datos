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

  async findOne(membershipId: number): Promise<Membership> {
    const Membership = await this.Repo.findOne({
      where: { id: membershipId },
    });
    if (!Membership) {
      throw new NotFoundException(`Membership ${membershipId} not found`);
    }
    return Membership;
  }

  async create(info_Membership: CreateMembershipDto) {
    const newMembership = this.Repo.create(info_Membership);
    return this.Repo.save(newMembership);
  }

  async update(
    membershipId: number,
    infoMembership: UpdateMembershipDto,
  ): Promise<Membership> {
    await this.Repo.update(membershipId, infoMembership);
    return this.findOne(membershipId);
  }

  async remove(membershipId: number): Promise<void> {
    await this.Repo.delete(membershipId);
  }
}
