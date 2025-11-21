import { metodo_pago } from "../pago/pago.entity"
import { estado_pago } from "../pago/pago.entity"

export default [

    {
        reserva_id: 1,
        usuario_id: 1,
        monto: 150.75,
        fecha_pago: new Date('2025-11-01T10:30:00'),
        metodo_pago: metodo_pago.VISA,
        estado_pago: estado_pago.PAGADO,
        nota: 'Pago realizado con éxito'
    },
    {
        reserva_id: 2,
        usuario_id: 1,
        monto: 200.00,
        fecha_pago: new Date('2025-11-02T12:45:00'),
        metodo_pago: metodo_pago.PAY_PAL,
        estado_pago: estado_pago.NO_PAGADO,
        nota: 'Pago pendiente de confirmación'
    }
]