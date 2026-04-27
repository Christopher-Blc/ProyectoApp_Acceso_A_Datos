import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
        //nos hace falta pista aqui para calcular el precio total 
        @InjectRepository(Pista)
        private readonly pistaRepo: Repository<Pista>, 
        private readonly userService: UsersService,
    ) {}

    async findAll(): Promise<Reserva[]> {
        return this.reservaRepo.find({ relations: ['usuario', 'pista', 'pagos'] });
    }

    async findOne(reserva_id: number): Promise<Reserva> {
        const reserva = await this.reservaRepo.findOne({
            where: { reserva_id: reserva_id },
            relations: ['usuario', 'pista', 'pagos'], // 
        });
        if (!reserva) {
            throw new NotFoundException('No se ha encontrado esa reserva.');
        }
        return reserva;
    }

    async findByUserId(usuario_id: number): Promise<Reserva[]> {
        if (!usuario_id) throw new ForbiddenException('No tienes permiso para ver estas reservas');
        const reservas = await this.reservaRepo.find({
            where: { usuario_id},
            relations: [ 
            'pista',
            'pista.tipo_pista', 
         ],
        });
        return reservas;
    }

    async create(dto: CreateReservaDto, usuario_id: number): Promise<Reserva> {
        // 1. Buscamos la pista para obtener su precio por hora real  
        const pista = await this.pistaRepo.findOneBy({ pista_id: dto.pista_id });
        if (!pista) throw new NotFoundException('Pista no encontrada');

        // 2. Calculamos la duración exacta  
        const [hInicio, mInicio] = dto.hora_inicio.split(':').map(Number);
        const [hFin, mFin] = dto.hora_fin.split(':').map(Number);
        const totalMinutos = (hFin * 60 + mFin) - (hInicio * 60 + mInicio);
        
        if (totalMinutos <= 0) {
            throw new ForbiddenException('La hora de fin debe ser posterior a la de inicio');
        }
        
        const duracionHoras = totalMinutos / 60;
        const precioCalculado = Number((duracionHoras * pista.precio_hora).toFixed(2));

        // 4. Creamos la reserva con estado PENDIENTE por defecto 
        const newReserva = this.reservaRepo.create({
            ...dto,
            usuario_id,
            precio_total: precioCalculado,
            estado: estadoReserva.PENDIENTE, 
        });

        const saved = await this.reservaRepo.save(newReserva);
        return this.findOne(saved.reserva_id);
    }

    async update(reserva_id: number, dto: UpdateReservaDto, user_id: number, user_role: UserRole): Promise<Reserva> {
        const reserva = await this.findOne(reserva_id);

        // Bloqueo de seguridad: Solo se edita si está PENDIENTE
        if (reserva.estado !== estadoReserva.PENDIENTE && user_role === UserRole.CLIENTE) {
            throw new ForbiddenException('No puedes modificar una reserva que ya ha sido procesada o pagada.');
        }

        // Verificamos permisos
        const isAdmin = user_role === UserRole.SUPER_ADMIN || user_role === UserRole.ADMINISTRACION;
        if (reserva.usuario_id !== user_id && !isAdmin) {
            throw new ForbiddenException('No tienes permiso para editar esta reserva');
        }

        // Si se cambian horas o pista, recalculamos el precio
        if (dto.pista_id || dto.hora_inicio || dto.hora_fin) {
            const id_pista = dto.pista_id || reserva.pista_id;
            const h_inicio = dto.hora_inicio || reserva.hora_inicio;
            const h_fin = dto.hora_fin || reserva.hora_fin;

            const pista = await this.pistaRepo.findOneBy({ pista_id: id_pista });
            if (!pista) throw new NotFoundException('Esa pista no existe');

            const [h1, m1] = h_inicio.split(':').map(Number);
            const [h2, m2] = h_fin.split(':').map(Number);
            const totalMinutos = (h2 * 60 + m2) - (h1 * 60 + m1);
            if (totalMinutos <= 0) throw new ForbiddenException('La hora de fin debe ser posterior a la de inicio');

            const duracion = totalMinutos / 60;
            (dto as any).precio_total = Number((duracion * pista.precio_hora).toFixed(2));
        }

        // Recalculamos membresia cuando la reserva entra o sale de FINALIZADA.
        const estadoAnterior = reserva.estado;
        const nuevoEstado = dto.estado;

        await this.reservaRepo.update(reserva_id, dto);

        const cambiaEstadoFinalizacion =
            nuevoEstado !== undefined &&
            (
                (estadoAnterior !== estadoReserva.FINALIZADA && nuevoEstado === estadoReserva.FINALIZADA) ||
                (estadoAnterior === estadoReserva.FINALIZADA && nuevoEstado !== estadoReserva.FINALIZADA)
            );

        if (cambiaEstadoFinalizacion) {
            await this.userService.updateUserRank(reserva.usuario_id);
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
}
