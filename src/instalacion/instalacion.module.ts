import { Module } from '@nestjs/common';
import { InstalacionController } from './instalacion.controller';
import { InstalacionService } from './instalacion.service';

@Module({
  controllers: [InstalacionController],
  providers: [InstalacionService]
})
export class InstalacionModule {}
