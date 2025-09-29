import { Module } from '@nestjs/common';
import { MembresiaController } from './membresia.controller';
import { MembresiaService } from './membresia.service';

@Module({
  controllers: [MembresiaController],
  providers: [MembresiaService]
})
export class MembresiaModule {}
