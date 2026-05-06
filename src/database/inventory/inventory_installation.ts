import { InstallationStatus } from '../../modules/installation/entities/installation.entity';

export default [
  {
    name: 'Installation Central',
    address: 'Calle Principal 123, Ciudad',
    phone: '123-456-7890',
    email: 'Installation.central@example.com',
    description: 'Installation deportiva',
    createdAt: new Date('2023-01-15T10:00:00'),
    status: InstallationStatus.ACTIVE,
  },
];
