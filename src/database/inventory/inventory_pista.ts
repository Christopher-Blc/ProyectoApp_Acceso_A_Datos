import {
  EstadoCourt,
  DiaSemana,
} from '../../modules/court/entities/court.entity';

export default [
  {
    instalacion_id: 1,
    tipo_pista_id: 1, // ID del TipoCourt (Tenis, etc.)
    nombre: 'Court Central Tenis',
    capacidad: 4,
    precio_hora: 15.5,
    cubierta: true, // Cambiado de cobertura (enum) a cubierta (boolean)
    iluminacion: true,
    descripcion: 'Court de tenis con iluminación nocturna y superficie rápida.',
    estado: EstadoPista.DISPONIBLE,
    hora_apertura: '08:00:00',
    hora_cierre: '22:00:00',
    dia_semana: DiaSemana.LUNES, // Campo obligatorio por el @Unique de la Entity
    reservations_made: 5,
  },
  {
    instalacion_id: 1,
    tipo_pista_id: 2,
    nombre: 'Court Padel 1',
    capacidad: 4,
    precio_hora: 10.0,
    cubierta: false,
    iluminacion: true,
    descripcion: 'Court de pádel de cristal.',
    estado: EstadoPista.DISPONIBLE,
    hora_apertura: '08:00:00',
    hora_cierre: '22:00:00',
    dia_semana: DiaSemana.LUNES,
    reservations_made: 5,
  },
];



