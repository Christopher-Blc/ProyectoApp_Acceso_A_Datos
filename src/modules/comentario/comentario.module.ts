import { Module } from '@nestjs/common';
import { ComentarioService } from './comentario.service';
import { ComentarioController } from './comentario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comentario } from './comentario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comentario])],
  providers: [ComentarioService],
  controllers: [ComentarioController]
})
export class ComentarioModule {}
