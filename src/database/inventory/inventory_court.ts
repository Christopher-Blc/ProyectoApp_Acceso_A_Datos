import {
  CourtStatus,
  DayOfWeek,
} from '../../modules/court/entities/court.entity';

export default [
  {
    installation_id: 1,
    court_type_id: 1,
    name: 'Court Central Tenis',
    capacity: 4,
    price_per_hour: 15.5,
    is_covered: true,
    has_lighting: true,
    description: 'Court de tenis con iluminación nocturna y superficie rápida.',
    status: CourtStatus.AVAILABLE,
    opening_time: '08:00:00',
    closing_time: '22:00:00',
    day_of_week: DayOfWeek.MONDAY,
    reservations_made: 5,
  },
  {
    installation_id: 1,
    court_type_id: 2,
    name: 'Court Padel 1',
    capacity: 4,
    price_per_hour: 10.0,
    is_covered: false,
    has_lighting: true,
    description: 'Court de pádel de cristal.',
    status: CourtStatus.AVAILABLE,
    opening_time: '08:00:00',
    closing_time: '22:00:00',
    day_of_week: DayOfWeek.MONDAY,
    reservations_made: 5,
  },
];
