import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resenya } from './entities/resenya.entity';
import { ResenyaController } from './resenya.controller';
import { ResenyaService } from './resenya.service';

@Module({
  imports: [TypeOrmModule.forFeature([Resenya])],
  providers: [ResenyaService],
  controllers: [ResenyaController]
})
export class ResenyaModule {}






