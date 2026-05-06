import { estado_instalacion } from '../../modules/installation/entities/installation.entity';

export default [
  {
    name: 'Installation Central',
    address: 'Calle Principal 123, Ciudad',
    phone: '123-456-7890',
    email: 'Installation.central@example.com',
    description: 'Installation deportiva',
    creation_date: new Date('2023-01-15T10:00:00'),
    status: estado_instalacion.ACTIVE,
  },
];
