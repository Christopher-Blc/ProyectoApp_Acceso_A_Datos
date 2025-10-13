import { Module } from '@nestjs/common';
import { InstalacionController } from './instalacion.controller';
import { InstalacionService } from './instalacion.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instalacion } from './instalacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Instalacion])],
  controllers: [InstalacionController],
  providers: [InstalacionService]
})
export class InstalacionModule {}
