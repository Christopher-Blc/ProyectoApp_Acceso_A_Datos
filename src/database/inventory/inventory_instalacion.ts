import { estado_Installation } from '../../modules/installation/entities/installation.entity';

export default [
  {
    nombre: 'Installation Central',
    direccion: 'Calle Principal 123, Ciudad',
    telefono: '123-456-7890',
    email: 'instalacion.central@example.com',
    descripcion: 'Installation deportiva',
    fecha_creacion: new Date('2023-01-15T10:00:00'),
    estado: estado_instalacion.ACTIVA,
  },
];



