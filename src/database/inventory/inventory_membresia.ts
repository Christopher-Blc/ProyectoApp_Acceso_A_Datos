import { estado_membresia } from "../membresia/membresia.entity";

export default [

    {
        usuario_id: 1,
        tipo: 'Premium',
        fecha_inicio: new Date('2024-01-01T00:00:00'),
        fecha_fin: new Date('2024-12-31T23:59:59'),
        estado: estado_membresia.ACTIVA,
        descuento: 15.00,
        renovable: true,
        fecha_renovacion: new Date('2024-12-31T23:59:59'),
    },
]