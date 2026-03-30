import { estadoReserva } from "../reserva/reserva.entity";

export default [
    {
        usuario_id: 1,
        pista_id: 1,
        pago_id: 1,
        fecha_reserva: new Date('2025-10-10T10:24:04'),
        fecha_inicio: new Date('2025-10-12T10:00:00'),
        fecha_fin: new Date('2025-10-12T11:00:00'),
        estado: estadoReserva.FINALIZADA,
        precio_final: 25,
        fecha_creacion: new Date('2025-10-10T10:24:04'),
        codigo_reserva: '1001',
        nota: 'Reserva de pruebas',
    },
    {
        usuario_id: 1,
        pista_id: 1,
        pago_id: 2,
        fecha_reserva: new Date('2025-11-01T14:30:00'),
        fecha_inicio: new Date('2025-11-03T15:00:00'),
        fecha_fin: new Date('2025-11-03T16:00:00'),
        estado: estadoReserva.CONFIRMADA,
        precio_final: 30,
        fecha_creacion: new Date('2025-11-01T14:30:00'),
        codigo_reserva: '1002',
        nota: 'Reserva confirmada',
    }
]