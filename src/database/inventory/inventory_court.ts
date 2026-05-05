import {
  EstadoCourt,
  DiaSemana,
} from '../../modules/court/entities/court.entity';

export default [
  {
    installation_id: 1,
    court_type_id: 1, // ID del CourtType (Tenis, etc.)
    nombre: 'Court Central Tenis',
    capacity: 4,
    price_per_hour: 15.5,
    covered: true, // Cambiado de cobertura (enum) a covered (boolean)
    lighting: true,
    description: 'Court de tenis con iluminación nocturna y superficie rápida.',
    status: EstadoCourt.DISPONIBLE,
    opening_time: '08:00:00',
    closing_time: '22:00:00',
    day_of_week: DiaSemana.LUNES,
    reservations_made: 5,
  },
  {
    installation_id: 1,
    court_type_id: 2,
    nombre: 'Court Padel 1',
    capacity: 4,
    price_per_hour: 10.0,
    covered: false,
    lighting: true,
    description: 'Court de pádel de cristal.',
    estado: EstadoCourt.DISPONIBLE,
    hora_apertura: '08:00:00',
    hora_cierre: '22:00:00',
    dia_semana: DiaSemana.LUNES,
    reservations_made: 5,
  },
];





