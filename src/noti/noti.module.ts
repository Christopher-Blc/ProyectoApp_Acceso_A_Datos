import { Module } from '@nestjs/common';
import { NotiService } from './noti.service';
import { NotiController } from './noti.controller';

@Module({
  providers: [NotiService],
  controllers: [NotiController]
})
export class NotiModule {}
