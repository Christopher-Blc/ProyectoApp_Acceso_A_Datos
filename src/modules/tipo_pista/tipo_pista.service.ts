import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoPista } from './entities/tipo_pista.entity';
import { TipoPistaDto } from './dto/tipo_pista.dto';

@Injectable()
export class TipoPistaService {
  constructor(
    @InjectRepository(TipoPista)
    private readonly tipoPistaRepository: Repository<TipoPista>,
  ) {}

  // Obtener todos los tipos de pista
  async findAll(): Promise<TipoPista[]> {
    return await this.tipoPistaRepository.find({
      order: { nombre: 'ASC' }, // Los devolvemos ordenados alfabéticamente
    });
  }

  // Obtener uno por ID
  async findOne(id: number): Promise<TipoPista> {
    const tipo = await this.tipoPistaRepository.findOneBy({ tipo_pista_id: id });
    if (!tipo) {
      throw new NotFoundException(`El tipo de pista con ID ${id} no existe`);
    }
    return tipo;
  }

  // Crear un nuevo tipo
  async create(dto: TipoPistaDto): Promise<TipoPista> {
    try {
      const nuevoTipo = this.tipoPistaRepository.create(dto);
      return await this.tipoPistaRepository.save(nuevoTipo);
    } catch (error) {
      // Manejo por si el nombre es único y ya existe
      if (error.code === '23505') {
        throw new BadRequestException('Este tipo de pista ya está registrado');
      }
      throw error;
    }
  }

  // Actualizar (Put/Patch)
  async update(id: number, dto: TipoPistaDto): Promise<TipoPista> {
    const tipo = await this.findOne(id); // Reutilizamos findOne para validar que existe
    
    // Fusionamos los cambios del DTO en la entidad encontrada
    this.tipoPistaRepository.merge(tipo, dto);
    
    return await this.tipoPistaRepository.save(tipo);
  }

  // Eliminar
  async remove(id: number): Promise<{ deleted: boolean }> {
    const tipo = await this.findOne(id);
    
    try {
      await this.tipoPistaRepository.remove(tipo);
      return { deleted: true };
    } catch (error) {
      // Si hay pistas vinculadas a este tipo, la base de datos dará error de FK
      throw new BadRequestException(
        'No se puede eliminar el tipo porque tiene pistas asociadas. Elimina primero las pistas.',
      );
    }
  }
}