import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CourtType } from './entities/court_type.entity';
import { Court } from '../court/entities/court.entity';
import {
  CreateCourtTypeDto,
  UpdateCourtTypeDto,
} from './dto/court_type.dto';

export type CourtTypeWithCount = CourtType & { totalCourts: number };
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CourtTypeService {
  constructor(
    @InjectRepository(CourtType)
    private readonly tipoPistaRepository: Repository<CourtType>,
    @InjectRepository(Court)
    private readonly courtRepository: Repository<Court>,
  ) {}

  // Cuenta las pistas únicas (por nombre) para un tipo de Court
  private async countDistinctCourts(courtTypeId: number): Promise<number> {
    const result = await this.courtRepository
      .createQueryBuilder('c')
      .select('COUNT(DISTINCT c.name)', 'total')
      .where('c.court_type_id = :courtTypeId AND c.status = :status', {
        courtTypeId,
        status: 'DISPONIBLE',
      })
      .getRawOne<{ total: string }>();
    return Number(result?.total ?? 0);
  }

  // Obtener todos los tipos de Court
  async findAll(): Promise<CourtTypeWithCount[]> {
    const { entities, raw } = await this.tipoPistaRepository
      .createQueryBuilder('ct')
      .leftJoin('ct.courts', 'c', 'c.status = :status', { status: 'DISPONIBLE' })
      .addSelect('COUNT(DISTINCT c.name)', 'totalCourts')
      .groupBy('ct.id')
      .getRawAndEntities();

    return entities.map((entity, i) => ({
      ...entity,
      totalCourts: Number(raw[i].totalCourts ?? 0),
    }));
  }

  // Obtener uno por ID
  async findOne(id: number): Promise<CourtTypeWithCount> {
    const tipo = await this.tipoPistaRepository.findOneBy({ id });
    if (!tipo) {
      throw new NotFoundException(`No se ha encontrado ese tipo de Court`);
    }
    const totalCourts = await this.countDistinctCourts(id);
    return { ...tipo, totalCourts };
  }

  // Crear un nuevo tipo
  async create(dto: CreateCourtTypeDto, imageFilename?: string): Promise<CourtType> {
    //mirar primero si ya existe un tipo con ese nombre
    const existe = await this.tipoPistaRepository.findOne({
      where: { name: dto.name },
    });

    if (existe) {
      throw new BadRequestException('Este tipo de Court ya está registrado');
    }

    try {
      const nuevoTipo = this.tipoPistaRepository.create({
        ...dto,
        image: imageFilename || dto.image,
      });
      return await this.tipoPistaRepository.save(nuevoTipo);
    } catch {
      throw new InternalServerErrorException('Error al crear el tipo de Court');
    }
  }

  async update(
    id: number,
    dto: UpdateCourtTypeDto,
    imageFilename?: string,
  ): Promise<CourtType> {
    const tipo = await this.findOne(id);

    if (!tipo) {
      throw new NotFoundException('No se ha encontrado ese tipo de Court');
    }

    const updateData: UpdateCourtTypeDto = { ...dto };

    if (imageFilename) {
      // Borrar imagen antigua si existe y se sube una nueva
      if (tipo.image) {
        const oldPath = path.resolve(process.cwd(), 'public', tipo.image);
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch {
            console.warn(`No se pudo eliminar la imagen antigua: ${oldPath}`);
          }
        }
      }
      updateData.image = imageFilename;
    }

    this.tipoPistaRepository.merge(tipo, updateData);

    return await this.tipoPistaRepository.save(tipo);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const tipo = await this.findOne(id);

    try {
      await this.tipoPistaRepository.remove(tipo);
    } catch {
      throw new BadRequestException(
        'No se puede eliminar el tipo porque tiene pistas asociadas. Elimina primero las pistas.',
      );
    }

    // Solo borramos el archivo si la DB fue exitosa
    if (tipo.image) {
      const filePath = path.resolve(process.cwd(), 'public', tipo.image);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch {
          // Log but don't fail the request
          console.warn(`No se pudo eliminar la imagen: ${filePath}`);
        }
      }
    }

    return { deleted: true };
  }
}
