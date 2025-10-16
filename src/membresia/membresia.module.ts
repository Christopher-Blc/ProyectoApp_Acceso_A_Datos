import { Module } from '@nestjs/common';
import { MembresiaController } from './membresia.controller';
import { MembresiaService } from './membresia.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Noti } from 'src/noti/noti.entity';
import { Membresia } from './membresia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Membresia])],
  controllers: [MembresiaController],
  providers: [MembresiaService]
})
export class MembresiaModule {}
