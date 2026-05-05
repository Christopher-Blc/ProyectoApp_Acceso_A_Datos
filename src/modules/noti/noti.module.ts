import { Module } from '@nestjs/common';
import { NotiService } from './noti.service';
import { NotiController } from './noti.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Noti } from './entities/noti.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Noti, User])],
  providers: [NotiService],
  controllers: [NotiController],
})
export class NotiModule {}
