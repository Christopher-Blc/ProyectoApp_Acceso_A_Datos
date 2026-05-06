import {
  CourtStatus,
  DayOfWeek,
} from '../../modules/court/entities/court.entity';

export default [
  {
    installationId: 1,
    courtTypeId: 1, // ID del CourtType (Tenis, etc.)
    name: 'Court Central Tenis',
    capacity: 4,
    pricePerHour: 15.5,
    isCovered: true, // Cambiado de cobertura (enum) a covered (boolean)
    hasLighting: true,
    description: 'Court de tenis con iluminación nocturna y superficie rápida.',
    status: CourtStatus.AVAILABLE,
    openingTime: '08:00:00',
    closingTime: '22:00:00',
    dayOfWeek: DayOfWeek.MONDAY,
    reservationsMade: 5,
  },
  {
    installationId: 1,
    courtTypeId: 2,
    name: 'Court Padel 1',
    capacity: 4,
    pricePerHour: 10.0,
    isCovered: false,
    hasLighting: true,
    description: 'Court de pádel de cristal.',
    status: CourtStatus.AVAILABLE,
    openingTime: '08:00:00',
    closingTime: '22:00:00',
    dayOfWeek: DayOfWeek.MONDAY,
    reservationsMade: 5,
  },
];
