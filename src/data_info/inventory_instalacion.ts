import { estado_instalacion } from "../instalacion/instalacion.entity";

export default [

    {
        pista_id: 1,
        nombre: 'Instalacion Central',
        direccion: 'Calle Principal 123, Ciudad',
        telefono: '123-456-7890',
        email: 'instalacion.central@example.com',
        capacidad_max: 100,
        descripcion: 'Instalacion deportiva',
        fecha_creacion: new Date('2023-01-15T10:00:00'),
        estado: estado_instalacion.ACTIVA,
        horario_apertura: new Date('1970-01-01T08:00:00'),
        horario_cierre: new Date('1970-01-01T22:00:00'),
    }
]