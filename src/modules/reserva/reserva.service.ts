import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { estadoReserva, Reserva } from './entities/reserva.entity';
import { CreateReservaDto, UpdateReservaDto } from './dto/reserva.dto';
import { UserRole } from '../users/entities/user.entity';
import { Pista } from '../pista/entities/pista.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepo: Repository<Reserva>,
    @InjectRepository(Pista)
    private readonly pistaRepo: Repository<Pista>,
    private readonly userService: UsersService,
  ) {}

  async findAll(pista_id?: number, fecha_desde?: string): Promise<Reserva[]> {
    const where: any = {};

    if (pista_id) {
      where.pista_id = pista_id;
    }

    if (fecha_desde) {
      where.fecha_reserva = MoreThanOrEqual(fecha_desde);
    }

    return this.reservaRepo.find({
      where,
      relations: ['usuario', 'pista', 'pagos'],
      order: { fecha_reserva: 'ASC', hora_inicio: 'ASC' } 
    });
  }

  async findOne(reserva_id: number): Promise<Reserva> {
    const reserva = await this.reservaRepo.findOne({
      where: { reserva_id },
      relations: ['usuario', 'pista', 'pagos'],
    });
    if (!reserva) throw new NotFoundException('No se ha encontrado esa reserva.');
    return reserva;
  }

  async findByUserId(usuario_id: number): Promise<Reserva[]> {
    if (!usuario_id) throw new ForbiddenException('No tienes permiso');
    return this.reservaRepo.find({
      where: { usuario_id },
      relations: ['usuario', 'pista', 'pagos'],
    });
  }

  async create(dto: CreateReservaDto, usuario_id: number): Promise<Reserva> {
    const pista = await this.pistaRepo.findOneBy({ pista_id: dto.pista_id });
    if (!pista) throw new NotFoundException('Pista no encontrada');

    //calculamos el precio final aqui para que no se hagan trampas desde el front
    const precioCalculado = this.calcularPrecio(
      Number(pista.precio_hora), 
      dto.hora_inicio, 
      dto.hora_fin
    );

    const newReserva = this.reservaRepo.create({
      ...dto,
      usuario_id,
      precio_total: precioCalculado,
      estado: estadoReserva.PENDIENTE,
    });

    const saved = await this.reservaRepo.save(newReserva);
    return this.findOne(saved.reserva_id);
  }

  async update(
    reserva_id: number,
    dto: UpdateReservaDto,
    user_id: number,
    user_role: UserRole,
  ): Promise<Reserva> {
    const reserva = await this.findOne(reserva_id);

    // 1. Verificamos permisos de edición
    const isAdmin = user_role === UserRole.SUPER_ADMIN || user_role === UserRole.ADMINISTRACION;
    
    if (reserva.usuario_id !== user_id && !isAdmin) {
      throw new ForbiddenException('No tienes permiso para editar esta reserva');
    }

    // 2. Bloqueo: Clientes no tocan reservas pagadas/procesadas
    if (reserva.estado !== estadoReserva.PENDIENTE && !isAdmin) {
      throw new ForbiddenException('No puedes modificar una reserva ya procesada.');
    }

    // 3. Recálculo de precio (Solo si cambian datos clave y NO está pagada, o si es Admin)
    if (dto.pista_id || dto.hora_inicio || dto.hora_fin) {
      const id_pista = dto.pista_id || reserva.pista_id;
      const h_inicio = dto.hora_inicio || reserva.hora_inicio;
      const h_fin = dto.hora_fin || reserva.hora_fin;

      const pista = await this.pistaRepo.findOneBy({ pista_id: id_pista });
      if (!pista) throw new NotFoundException('Esa pista no existe');

      // Actualizamos el precio_total en el objeto que se va a guardar
      (dto as any).precio_total = this.calcularPrecio(
        Number(pista.precio_hora), 
        h_inicio, 
        h_fin
      );
    }

    // 4. Lógica de Rango de Usuario (Membresía)
    const estadoAnterior = reserva.estado;
    const nuevoEstado = dto.estado;

    await this.reservaRepo.update(reserva_id, dto);

    // Si el estado pasa a FINALIZADA (o deja de serlo), actualizamos el rango
    if (nuevoEstado && nuevoEstado !== estadoAnterior) {
        if (nuevoEstado === estadoReserva.FINALIZADA || estadoAnterior === estadoReserva.FINALIZADA) {
            await this.userService.updateUserRank(reserva.usuario_id);
        }
    }

    return this.findOne(reserva_id);
  }

  async remove(reserva_id: number): Promise<{ deleted: boolean }> {
    const reserva = await this.findOne(reserva_id);
    const eraFinalizada = reserva.estado === estadoReserva.FINALIZADA;
    
    await this.reservaRepo.delete(reserva.reserva_id);

    if (eraFinalizada) {
      await this.userService.updateUserRank(reserva.usuario_id);
    }

    return { deleted: true };
  }

  //Funcion que calcula el precio total de la reserva segun la pista y las horas de inicio y fin
  private calcularPrecio(pistaPrecio: number, inicio: string, fin: string): number {
    const [hI, mI] = inicio.split(':').map(Number);
    const [hF, mF] = fin.split(':').map(Number);
    
    const minutosInicio = hI * 60 + mI;
    const minutosFin = hF * 60 + mF;
    
    // Calculamos la diferencia
    let diferencia = minutosFin - minutosInicio;

    // Si es negativa (ej: 23:00 a 01:00), es que saltó el día.
    // Sumamos 1440 para sacar los minutos reales de diferencia.
    if (diferencia < 0) {
      diferencia += 1440; 
    }

    // Si es 0, es que han puesto la misma hora (error)
    if (diferencia === 0) {
      throw new ForbiddenException('La hora de inicio y fin no pueden ser iguales');
    }

    const duracionHoras = diferencia / 60;
    
    // Devolvemos el precio final bien calculado
    return Number((duracionHoras * pistaPrecio).toFixed(2));
  }
}