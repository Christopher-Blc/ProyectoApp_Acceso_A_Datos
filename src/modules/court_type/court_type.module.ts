import { Module } from '@nestjs/common';
import { CourtTypeController } from './court_type.controller';
import { CourtTypeService } from './court_type.service';
import { CourtType } from './entities/court_type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CourtType])],
  controllers: [CourtTypeController],
  providers: [CourtTypeService],
  exports: [CourtTypeService],
})
export class CourtTypeModule {}
