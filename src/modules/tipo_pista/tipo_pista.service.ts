import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoPista } from './entities/tipo_pista.entity';
import { TipoPistaDto, UpdateTipoPistaDto } from './dto/tipo_pista.dto';

@Injectable()
export class TipoPistaService {
  constructor(
    @InjectRepository(TipoPista)
    private readonly tipoPistaRepository: Repository<TipoPista>,
  ) {}

  // Obtener todos los tipos de pista
  async findAll(): Promise<TipoPista[]> {
    return await this.tipoPistaRepository.find({ relations: ['pistas'] });
  }

  // Obtener uno por ID
  async findOne(id: number): Promise<TipoPista> {
    const tipo = await this.tipoPistaRepository.findOneBy({
      tipo_pista_id: id,
    });
    if (!tipo) {
      throw new NotFoundException(`No se ha encontrado ese tipo de pista`);
    }
    return tipo;
  }

  // Crear un nuevo tipo
  async create(dto: TipoPistaDto): Promise<TipoPista> {
    //mirar primero si ya existe un tipo con ese nombre
    const existe = await this.tipoPistaRepository.findOne({
      where: { nombre: dto.nombre },
    });

    if (existe) {
      throw new BadRequestException('Este tipo de pista ya está registrado');
    }

    try {
      const nuevoTipo = this.tipoPistaRepository.create(dto);
      return await this.tipoPistaRepository.save(nuevoTipo);
    } catch {
      throw new InternalServerErrorException('Error al crear el tipo de pista');
    }
  }

  async update(id: number, dto: UpdateTipoPistaDto): Promise<TipoPista> {
    const tipo = await this.findOne(id);

    if (!tipo) {
      throw new NotFoundException('No se ha encontrado ese tipo de pista');
    }
    this.tipoPistaRepository.merge(tipo, dto);

    return await this.tipoPistaRepository.save(tipo);
  }

  // Eliminar
  async remove(id: number): Promise<{ deleted: boolean }> {
    const tipo = await this.findOne(id);

    try {
      await this.tipoPistaRepository.remove(tipo);
      return { deleted: true };
    } catch {
      // Si hay pistas vinculadas a este tipo, la base de datos dará error de FK
      throw new BadRequestException(
        'No se puede eliminar el tipo porque tiene pistas asociadas. Elimina primero las pistas.',
      );
    }
  }
}
