import { estadoReserva } from "../../modules/reserva/entities/reserva.entity";

export default [
    // Usuario 1: Varias reservas FINALIZADAS para probar la subida de rango
    {
        usuario_id: 1,
        pista_id: 1,
        fecha_reserva: new Date('2025-01-10'),
        hora_inicio: '10:00', 
        hora_fin: '12:00',  
        estado: estadoReserva.FINALIZADA,
        nota: 'Primera reserva finalizada',
    },
    {
        usuario_id: 1,
        pista_id: 2,
        fecha_reserva: new Date('2025-02-15'),
        hora_inicio: '11:00',
        hora_fin: '12:30',  
        estado: estadoReserva.FINALIZADA,
        nota: 'Segunda reserva finalizada',
    },
    {
        usuario_id: 1,
        pista_id: 1,
        fecha_reserva: new Date('2025-03-05'),
        hora_inicio: '18:00',
        hora_fin: '20:00',  
        estado: estadoReserva.FINALIZADA,
        nota: 'Tercera reserva finalizada',
    },
    // Usuario 1: Una reserva a futuro (CONFIRMADA)
    {
        usuario_id: 1,
        pista_id: 1,
        fecha_reserva: new Date('2026-11-01'),
        hora_inicio: '15:00',
        hora_fin: '16:30',  
        estado: estadoReserva.CONFIRMADA,
        nota: 'Reserva futura para probar bloqueo de borrado',
    },
    // Usuario 2: Reserva pendiente
    {
        usuario_id: 2,
        pista_id: 3,
        fecha_reserva: new Date('2026-05-20'),
        hora_inicio: '09:00',
        hora_fin: '10:00',  
        estado: estadoReserva.PENDIENTE,
        nota: 'Reserva pendiente de pago',
    }
];