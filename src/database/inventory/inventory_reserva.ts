import { estadoReserva } from "../../modules/reserva/entities/reserva.entity";

export default [
    {
        usuario_id: 1,
        pista_id: 1,
        fecha_reserva: new Date('2025-10-10'),
        hora_inicio: '10:00', 
        hora_fin: '12:00',  
        estado: estadoReserva.FINALIZADA,
        nota: 'Reserva de pruebas',
    },
    {
        usuario_id: 1,
        pista_id: 1,
        fecha_reserva: new Date('2025-11-01'),
        hora_inicio: '15:00',
        hora_fin: '16:30',  
        estado: estadoReserva.CONFIRMADA,
        nota: 'Reserva confirmada',
    }
]