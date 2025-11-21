import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Noti } from './noti.entity';
import { Repository } from 'typeorm';
import { UpdateNotiDto } from './noti.dto';

@Injectable()
export class NotiService {
    constructor( 
        @InjectRepository(Noti)
        private readonly notiRepository: Repository<Noti>,
    ){}

    findAll() {
        return this.notiRepository.find({
            relations: ['user'],
        });
    }

    findOne(noti_id: number) {
        return this.notiRepository.findOne({
            where: { noti_id },
            relations: ['user'],
        });
    }

    async create(data: Partial<Noti>) {
        const noti = this.notiRepository.create(data);
        return this.notiRepository.save(noti);
    }

    async update(noti_id: number, data: UpdateNotiDto) {
        await this.notiRepository.update(noti_id, data);
        return this.findOne(noti_id);
    }

    async remove (id: number) {
        await this.notiRepository.delete(id);
        return { deleted: true };
    }
}
