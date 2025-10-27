import { metodo_pago } from "../pago/pago.entity"
import { estado_pago } from "../pago/pago.entity"

export default [

    {
        reserva_id: '1',
        usuario_id: '1',
        monto: 150.75,
        fecha_pago: new Date('2025-11-01T10:30:00'),
        metodo_pago: metodo_pago.VISA,
        estado_pago: estado_pago.PAGADO,
        nota: 'Pago realizado con éxito'
    }]