import { Module } from '@nestjs/common';
import { InstallationController } from './installation.controller';
import { InstallationService } from './installation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Installation } from './entities/installation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Installation])],
  controllers: [InstallationController],
  providers: [InstallationService],
})
export class InstallationModule {}
