import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourtType } from './entities/court_type.entity';
import { TipoCourtDto, UpdateTipoCourtDto } from './dto/court_type.dto';

@Injectable()
export class CourtTypeService {
  constructor(
    @InjectRepository(CourtType)
    private readonly tipoPistaRepository: Repository<CourtType>,
  ) {}

  // Obtener todos los tipos de Court
  async findAll(): Promise<CourtType[]> {
    return await this.tipoPistaRepository.find({ relations: ['pistas'] });
  }

  // Obtener uno por ID
  async findOne(id: number): Promise<CourtType> {
    const tipo = await this.tipoPistaRepository.findOneBy({
      tipo_pista_id: id,
    });
    if (!tipo) {
      throw new NotFoundException(`No se ha encontrado ese tipo de Court`);
    }
    return tipo;
  }

  // Crear un nuevo tipo
  async create(dto: TipoCourtDto, imagenFilename?: string): Promise<CourtType> {
    //mirar primero si ya existe un tipo con ese nombre
    const existe = await this.tipoPistaRepository.findOne({
      where: { nombre: dto.nombre },
    });

    if (existe) {
      throw new BadRequestException('Este tipo de Court ya está registrado');
    }

    try {
      const nuevoTipo = this.tipoPistaRepository.create({
        ...dto,
        imagen: imagenFilename || dto.imagen,
      }) as CourtType;
      return await this.tipoPistaRepository.save(nuevoTipo);
    } catch {
      throw new InternalServerErrorException('Error al crear el tipo de Court');
    }
  }

  async update(id: number, dto: UpdateTipoCourtDto, imagenFilename?: string): Promise<CourtType> {
    const tipo = await this.findOne(id);

    if (!tipo) {
      throw new NotFoundException('No se ha encontrado ese tipo de Court');
    }

    const updateData: UpdateTipoCourtDto = { ...dto };
    if (imagenFilename) {
      updateData.imagen = imagenFilename;
    }

    this.tipoPistaRepository.merge(tipo, updateData);

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




